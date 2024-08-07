package financialsaver.resourceserver.service.impl;

import financialsaver.resourceserver.entity.support.Color;
import financialsaver.resourceserver.entity.support.Logo;
import financialsaver.resourceserver.entity.support.SavingCategory;
import financialsaver.resourceserver.entity.support.SavingType;
import financialsaver.resourceserver.service.ColorService;
import financialsaver.resourceserver.service.LogoService;
import financialsaver.resourceserver.service.SavingService;
import financialsaver.resourceserver.service.UserInfoService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import financialsaver.resourceserver.dto.ExchangeDTO;
import financialsaver.resourceserver.dto.SavingDTO;
import financialsaver.resourceserver.entity.Saving;
import financialsaver.resourceserver.entity.UserInfo;
import financialsaver.resourceserver.repo.SavingRepo;
import financialsaver.resourceserver.repo.support.SavingCategoryRepo;
import financialsaver.resourceserver.utils.time.CalculateTimes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor_ = @Autowired)
@Log4j2
public class SavingServiceImpl implements SavingService {

    private SavingCategoryRepo savingCategoryRepo;
    private SavingRepo savingRepo;
    private UserInfoService userInfoService;
    private LogoService logoService;
    private ColorService colorService;
    @Override
    public List<Saving> getAllSaving() {
        return savingRepo.findAll();
    }

    @Override
    public Saving getBySavingId(UUID savingId) {
        Saving saving = savingRepo.findById(savingId).orElseThrow(() -> new IllegalArgumentException("SavingId is not exist!"));
        saving.setExpectedInterest(calculateExpectedInterest(saving, LocalDate.now()));
        saving.setCurrentAmount(saving.getOriginAmount().add(saving.getExpectedInterest()));
        return savingRepo.save(saving);
    }

    @Override
    public List<Saving> getAllByUserId(String userId) {
        List<Saving> savings = savingRepo.findAllByUser_UserId(userId);
        return savings;
    }

    @Override
    public List<Saving> createSaving(SavingDTO savingDTO) {
        Saving saving = new Saving();
        saving.setSavingId(UUID.randomUUID());

        UserInfo user = userInfoService.getUserById(savingDTO.getUserId());
        saving.setUser(user);

        Logo logo = logoService.getLogoById(savingDTO.getLogoId());
        saving.setLogo(logo);

        Color color = colorService.getById(savingDTO.getColorId());
        saving.setColor(color);

        SavingCategory savingCategory = savingCategoryRepo.findById(savingDTO.getSavingCategoryId())
                .orElseThrow(() -> new NoSuchElementException("Saving Category not found with ID: " + savingDTO.getSavingCategoryId()));
        saving.setSavingCategory(savingCategory);
        saving.setOriginAmount(savingDTO.getOriginAmount());
        saving.setTargetAmount(savingDTO.getTargetAmount());
        saving.setInterestRate(savingDTO.getInterestRate());
        saving.setName(savingDTO.getName());
        saving.setDescription(savingDTO.getDescription());
        saving.setTargetDate(savingDTO.getTargetDate());
        saving.setCreatedAt(new Date());
        saving.setUpdatedAt(new Date());

        saving.setSavingType(savingDTO.getSavingType());
        saving.setWalletId(savingDTO.getWalletId());
        saving.setStartDate(savingDTO.getStartDate());
        saving.setChangeDate(saving.getStartDate());
        saving.setReceiveInterestTime(savingDTO.getReceiveInterestTime());
        saving.setExpectedInterest(calculateExpectedInterest(saving, LocalDate.now()));
        saving.setCurrentAmount(savingDTO.getOriginAmount().add(saving.getExpectedInterest()));
        saving.setIsActive(true);

        savingRepo.save(saving);
        return getAllByUserId(savingDTO.getUserId());
    }

    @Override
    public Saving updateSaving(SavingDTO savingDTO, UUID savingId) throws IllegalAccessException {
        Saving saving = getBySavingId(savingId);

        if(!saving.getIsActive()){
            throw new IllegalAccessException("Can update finished saving!");
        }

        Logo logo = logoService.getLogoById(savingDTO.getLogoId());
        saving.setLogo(logo);

        Color color = colorService.getById(savingDTO.getColorId());
        saving.setColor(color);

        SavingCategory savingCategory = savingCategoryRepo.findById(savingDTO.getSavingCategoryId())
                .orElseThrow(() -> new NoSuchElementException("Saving Category not found with ID: " + savingDTO.getSavingCategoryId()));
        saving.setSavingCategory(savingCategory);
        saving.setCurrentAmount(savingDTO.getOriginAmount());
        saving.setOriginAmount(savingDTO.getOriginAmount());
        saving.setTargetAmount(savingDTO.getTargetAmount());
        saving.setInterestRate(savingDTO.getInterestRate());
        saving.setName(savingDTO.getName());
        saving.setDescription(savingDTO.getDescription());
        saving.setTargetDate(savingDTO.getTargetDate());
        saving.setUpdatedAt(new Date());

        saving.setSavingType(savingDTO.getSavingType());
        saving.setWalletId(savingDTO.getWalletId());
//        saving.setStartDate(savingDTO.getStartDate());
//        saving.setChangeDate(savingDTO.getStartDate());
        saving.setReceiveInterestTime(savingDTO.getReceiveInterestTime());
        saving.setExpectedInterest(calculateExpectedInterest(saving, LocalDate.now()));
        saving.setCurrentAmount(savingDTO.getOriginAmount().add(saving.getExpectedInterest()));

        return savingRepo.save(saving);
    }

    @Override
    public void updateSavingFromExchange(ExchangeDTO exchangeDTO) {
        System.out.println("Start update from exchange");
        Saving saving = getBySavingId(exchangeDTO.getDestinationId());
        System.out.println("Done get saving");
        LocalDate exchangeDate = exchangeDTO.getExchangeDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate startDate = saving.getChangeDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        if (exchangeDate.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Exchange date cannot be before the saving start date or after date now.");
        }
        if(exchangeDTO.getExchangeTypeId().equals("wallet_saving")){
            if(saving.getSavingType().equals(SavingType.ACCUMULATE_COMPOUND) || saving.getSavingType().equals(SavingType.NO_INTEREST) ){
                BigDecimal additionalAmount = exchangeDTO.getAmount();
                LocalDate newStartDate = CalculateTimes.calculateNewStartDate(startDate, exchangeDate, saving.getReceiveInterestTime());
                if(newStartDate.isAfter(LocalDate.now())){
                    newStartDate = CalculateTimes.calculatePreviousInterestDate(startDate, exchangeDate, saving.getReceiveInterestTime());
                    additionalAmount = calculateInterestWhenReceiveMoney(saving, additionalAmount);
                } else {
                    additionalAmount = additionalAmount.add(calculateInterestWhenCreateExchange(saving, newStartDate, additionalAmount, exchangeDate));
                }
                BigDecimal newInterestOfOriginAmountBefore = calculateExpectedInterest(saving, newStartDate);
                BigDecimal newOriginAmount = saving.getOriginAmount().add(newInterestOfOriginAmountBefore).add(additionalAmount);
                System.out.println(newStartDate.toString());
                System.out.println(newInterestOfOriginAmountBefore.toString());
                System.out.println(additionalAmount.toString());
                saving.setOriginAmount(newOriginAmount);
                saving.setChangeDate(Date.from(newStartDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
                BigDecimal totalInterest = calculateExpectedInterest(saving, LocalDate.now());;
                saving.setExpectedInterest(totalInterest);
                saving.setCurrentAmount(newOriginAmount.add(totalInterest));

                savingRepo.save(saving);
            } else {
                throw new IllegalArgumentException("This type of Saving is not accept change amount: " + exchangeDTO.getExchangeTypeId());
            }
        } else if(exchangeDTO.getExchangeTypeId().equals("saving_wallet")){
            BigDecimal subtractAmount = exchangeDTO.getAmount();

            if(subtractAmount.compareTo(saving.getCurrentAmount()) == 1){
                throw new IllegalArgumentException("Can get more than your saving current money");
            }


            LocalDate newStartDate = CalculateTimes.calculatePreviousInterestDate(startDate, exchangeDate, saving.getReceiveInterestTime());
            LocalDate nextStartDate = CalculateTimes.calculateNewStartDate(startDate, exchangeDate, saving.getReceiveInterestTime());

            if(exchangeDate.isBefore(startDate)){
                subtractAmount = subtractAmount.add(calculateInterestWhenCreateExchangeBack(saving, nextStartDate, subtractAmount, exchangeDate));
            } else {
                subtractAmount = subtractAmount.add(calculateInterestWhenCreateExchange(saving, nextStartDate, subtractAmount, exchangeDate));
            }
            BigDecimal interestBefore = calculateExpectedInterest(saving, newStartDate);

            BigDecimal newOriginAmount = saving.getOriginAmount().add(interestBefore).subtract(subtractAmount);
            saving.setOriginAmount(newOriginAmount);
            saving.setChangeDate(Date.from(newStartDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));

            BigDecimal totalInterest = calculateExpectedInterest(saving, LocalDate.now());;

            saving.setExpectedInterest(totalInterest);
            saving.setCurrentAmount(newOriginAmount.add(totalInterest));

            savingRepo.save(saving);
        }
    }

    @Override
    public List<SavingCategory> getAllSavingCategory() {
        return savingCategoryRepo.findAll();
    }

    @Override
    public List<Saving> removeSaving(UUID savingId) {
        Saving saving = getBySavingId(savingId);
        String userId = saving.getUser().getUserId();
        savingRepo.delete(saving);
        return getAllByUserId(userId);
    }

    @Override
    public void updateSavingAfterUpdateExchange(UUID savingId, BigDecimal amount, OffsetDateTime exchangeDate) {
        Saving saving = getBySavingId(savingId);
        System.out.println("Start updating saving after update exchange");

        LocalDate exchangeDateOld = exchangeDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        System.out.println("Exchange date old");
        BigDecimal interest = calculateRemoveInterest(saving, amount, exchangeDateOld);
        System.out.println("Calculated remove interest: " + interest.toString());

        saving.setOriginAmount(saving.getOriginAmount().add(amount).add(interest));
        System.out.println("Updated origin amount: " + saving.getOriginAmount().toString());
        saving.setExpectedInterest(calculateExpectedInterest(saving, LocalDate.now()));
        System.out.println("Calculated expected interest: " + saving.getExpectedInterest().toString());
        saving.setCurrentAmount(saving.getOriginAmount().add(saving.getExpectedInterest()));
        savingRepo.save(saving);
    }

    @Override
    public void doneSaving(Saving saving) {
        savingRepo.save(saving);
    }

    @Override
    public BigDecimal getSavingTotalAmount(String userId) {
        BigDecimal res = BigDecimal.ZERO;
        List<Saving> savings = getAllByUserId(userId).stream()
                .filter(saving -> saving.getIsActive().equals(true))
                .collect(Collectors.toList());
        for (Saving saving: savings) {
            res = res.add(saving.getCurrentAmount());
        }
        return res;
    }

    private BigDecimal calculateExpectedInterest(Saving saving, LocalDate endDate) {
        if (saving.getSavingType().equals(SavingType.NO_INTEREST) || saving.getInterestRate() == null || saving.getStartDate() == null || saving.getReceiveInterestTime() == null) {
            return BigDecimal.ZERO;
        }
        LocalDate startDate = saving.getChangeDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
//        LocalDate currentDate = LocalDate.now();
        BigDecimal principal = saving.getOriginAmount();
        BigDecimal annualRate = saving.getInterestRate();
        long divider = CalculateTimes.calculatePeriodsBetween(startDate, startDate.plusYears(1), saving.getReceiveInterestTime());
        BigDecimal rate = saving.getInterestRate().divide(BigDecimal.valueOf(100).multiply(BigDecimal.valueOf(divider)), 10, RoundingMode.HALF_UP);

        long periodsBetween = CalculateTimes.calculatePeriodsBetween(startDate, endDate, saving.getReceiveInterestTime());

        BigDecimal expectedInterest = BigDecimal.ZERO;

        if (saving.getSavingType() == SavingType.COMPOUND || saving.getSavingType() == SavingType.ACCUMULATE_COMPOUND) {
            expectedInterest = principal.multiply(BigDecimal.ONE.add(rate).pow((int) periodsBetween)).subtract(principal);
        } else if (saving.getSavingType() == SavingType.SIMPLE_INTEREST || saving.getSavingType() == SavingType.INTEREST_RETURN_WALLET) {
            expectedInterest = principal.multiply(rate).multiply(BigDecimal.valueOf(periodsBetween));
        }

        // Nếu có thể thì cần cải thiện thuật toán thêm cho một số trường hợp khác

        return expectedInterest.setScale(5, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateInterestWhenCreateExchange(Saving saving, LocalDate endDate, BigDecimal amount, LocalDate exchangeDate) {
        if (saving.getSavingType().equals(SavingType.NO_INTEREST) || saving.getInterestRate() == null || saving.getStartDate() == null || saving.getReceiveInterestTime() == null) {
            return BigDecimal.ZERO;
        }
        LocalDate startDate = exchangeDate;
        BigDecimal principal = amount;
        long divider = CalculateTimes.calculatePeriodsBetween(startDate, startDate.plusYears(1), saving.getReceiveInterestTime());
        BigDecimal rate = saving.getInterestRate().divide(BigDecimal.valueOf(100).multiply(BigDecimal.valueOf(divider)), 10, RoundingMode.HALF_UP);

        long periodsBetween = CalculateTimes.calculatePeriodsBetween(startDate, endDate, saving.getReceiveInterestTime());

        BigDecimal expectedInterest = BigDecimal.ZERO;

        if (saving.getSavingType() == SavingType.COMPOUND || saving.getSavingType() == SavingType.ACCUMULATE_COMPOUND) {
            expectedInterest = principal.multiply(BigDecimal.ONE.add(rate).pow((int) periodsBetween)).subtract(principal);
        } else if (saving.getSavingType() == SavingType.SIMPLE_INTEREST || saving.getSavingType() == SavingType.INTEREST_RETURN_WALLET) {
            expectedInterest = principal.multiply(rate).multiply(BigDecimal.valueOf(periodsBetween));
        }

        // Nếu có thể thì cần cải thiện thuật toán thêm cho một số trường hợp khác

        return expectedInterest.setScale(5, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateInterestWhenCreateExchangeBack(Saving saving, LocalDate endDate, BigDecimal amount, LocalDate exchangeDate) {
        if (saving.getSavingType().equals(SavingType.NO_INTEREST) || saving.getInterestRate() == null || saving.getStartDate() == null || saving.getReceiveInterestTime() == null) {
            return BigDecimal.ZERO;
        }
        LocalDate startDate = exchangeDate;
        BigDecimal principal = amount;
        long divider = CalculateTimes.calculatePeriodsBetween(startDate, startDate.plusYears(1), saving.getReceiveInterestTime());
        BigDecimal rate = saving.getInterestRate().divide(BigDecimal.valueOf(100).multiply(BigDecimal.valueOf(divider)), 10, RoundingMode.HALF_UP);

        long periodsBetween = CalculateTimes.calculatePeriodsBetween(startDate, endDate, saving.getReceiveInterestTime()) + 1;

        BigDecimal expectedInterest = BigDecimal.ZERO;

        if (saving.getSavingType() == SavingType.COMPOUND || saving.getSavingType() == SavingType.ACCUMULATE_COMPOUND) {
            expectedInterest = principal.multiply(BigDecimal.ONE.add(rate).pow((int) periodsBetween)).subtract(principal);
        } else if (saving.getSavingType() == SavingType.SIMPLE_INTEREST || saving.getSavingType() == SavingType.INTEREST_RETURN_WALLET) {
            expectedInterest = principal.multiply(rate).multiply(BigDecimal.valueOf(periodsBetween));
        }

        // Nếu có thể thì cần cải thiện thuật toán thêm cho một số trường hợp khác

        return expectedInterest.setScale(5, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateInterestWhenReceiveMoney(Saving saving, BigDecimal principal) {
        if (saving.getSavingType().equals(SavingType.NO_INTEREST) || saving.getInterestRate() == null || saving.getStartDate() == null || saving.getReceiveInterestTime() == null) {
            return BigDecimal.ZERO;
        }
        long divider = CalculateTimes.calculatePeriodsBetween(LocalDate.now(), LocalDate.now().plusYears(1), saving.getReceiveInterestTime());
        BigDecimal rate = saving.getInterestRate().divide(BigDecimal.valueOf(100).multiply(BigDecimal.valueOf(divider)), 10, RoundingMode.HALF_UP);

        BigDecimal res = BigDecimal.ZERO;

        if (saving.getSavingType() == SavingType.COMPOUND || saving.getSavingType() == SavingType.ACCUMULATE_COMPOUND) {
            res = principal.divide(BigDecimal.ONE.add(rate), 10, RoundingMode.HALF_UP);
        } else if (saving.getSavingType() == SavingType.SIMPLE_INTEREST || saving.getSavingType() == SavingType.INTEREST_RETURN_WALLET) {
            res = principal.divide(rate, 10, RoundingMode.HALF_UP);
        }

        // Nếu có thể thì cần cải thiện thuật toán thêm cho một số trường hợp khác

        return res.setScale(5, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateRemoveInterest(Saving saving, BigDecimal amount, LocalDate endDate) {
        if (saving.getSavingType().equals(SavingType.NO_INTEREST) || saving.getInterestRate() == null || saving.getStartDate() == null || saving.getReceiveInterestTime() == null) {
            return BigDecimal.ZERO;
        }
        LocalDate startDate = saving.getChangeDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
//        LocalDate currentDate = LocalDate.now();
        BigDecimal annualRate = saving.getInterestRate();
        long divider = CalculateTimes.calculatePeriodsBetween(startDate, startDate.plusYears(1), saving.getReceiveInterestTime());
        BigDecimal rate = saving.getInterestRate().divide(BigDecimal.valueOf(100).multiply(BigDecimal.valueOf(divider)), 5, RoundingMode.HALF_UP);

        long periodsBetween = CalculateTimes.calculatePeriodsBetween(endDate, startDate, saving.getReceiveInterestTime());

        BigDecimal expectedInterest = BigDecimal.ZERO;

        if (saving.getSavingType() == SavingType.COMPOUND || saving.getSavingType() == SavingType.ACCUMULATE_COMPOUND) {
            expectedInterest = amount.multiply(BigDecimal.ONE.add(rate).pow((int) periodsBetween)).subtract(amount);
        } else if (saving.getSavingType() == SavingType.SIMPLE_INTEREST || saving.getSavingType() == SavingType.INTEREST_RETURN_WALLET) {
            expectedInterest = amount.multiply(rate).multiply(BigDecimal.valueOf(periodsBetween));
        }

        // Nếu có thể thì cần cải thiện thuật toán thêm cho một số trường hợp khác

        return expectedInterest.setScale(2, RoundingMode.HALF_UP);
    }
}
