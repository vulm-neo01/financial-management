package openerp.openerpresourceserver.service.impl;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.ExchangeDTO;
import openerp.openerpresourceserver.dto.SavingDTO;
import openerp.openerpresourceserver.entity.Saving;
import openerp.openerpresourceserver.entity.UserInfo;
import openerp.openerpresourceserver.entity.support.*;
import openerp.openerpresourceserver.repo.SavingRepo;
import openerp.openerpresourceserver.repo.support.SavingCategoryRepo;
import openerp.openerpresourceserver.service.ColorService;
import openerp.openerpresourceserver.service.LogoService;
import openerp.openerpresourceserver.service.SavingService;
import openerp.openerpresourceserver.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

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
        saving.setExpectedInterest(calculateExpectedInterest(saving));
        saving.setCurrentAmount(saving.getCurrentAmount().add(saving.getExpectedInterest()));
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
        saving.setReceiveInterestTime(savingDTO.getReceiveInterestTime());
        saving.setExpectedInterest(calculateExpectedInterest(saving));
        saving.setCurrentAmount(savingDTO.getOriginAmount().add(saving.getExpectedInterest()));

        savingRepo.save(saving);
        return getAllByUserId(savingDTO.getUserId());
    }

    @Override
    public Saving updateSaving(SavingDTO savingDTO, UUID savingId) {
        Saving saving = getBySavingId(savingId);

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
        saving.setStartDate(savingDTO.getStartDate());
        saving.setReceiveInterestTime(savingDTO.getReceiveInterestTime());
        saving.setExpectedInterest(calculateExpectedInterest(saving));
        saving.setCurrentAmount(savingDTO.getOriginAmount().add(saving.getExpectedInterest()));

        return savingRepo.save(saving);
    }

    @Override
    public void updateSavingFromExchange(ExchangeDTO exchangeDTO) {
        Saving saving = getBySavingId(exchangeDTO.getDestinationId());

        if(exchangeDTO.getExchangeTypeId().equals("wallet_saving")){

        } else if(exchangeDTO.getExchangeTypeId().equals("saving_wallet")){

        }

        // CÓ cách nào tính ngược lại số tiền gốc khi biết currentAmount k :v

    }


    private BigDecimal calculateExpectedInterest(Saving saving) {
        if (saving.getSavingType().equals(SavingType.NO_INTEREST) || saving.getInterestRate() == null || saving.getStartDate() == null) {
            return BigDecimal.ZERO;
        }
        LocalDate startDate = saving.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate currentDate = LocalDate.now();
        BigDecimal principal = saving.getOriginAmount();
        BigDecimal annualRate = saving.getInterestRate();
        long divider = calculatePeriodsBetween(startDate, startDate.plusYears(1), saving.getReceiveInterestTime());
        BigDecimal rate = saving.getInterestRate().divide(BigDecimal.valueOf(100).multiply(BigDecimal.valueOf(divider)), 5, RoundingMode.HALF_UP);

        long periodsBetween = calculatePeriodsBetween(startDate, currentDate, saving.getReceiveInterestTime());

        BigDecimal expectedInterest = BigDecimal.ZERO;

        if (saving.getSavingType() == SavingType.COMPOUND) {
            expectedInterest = principal.multiply(BigDecimal.ONE.add(rate).pow((int) periodsBetween)).subtract(principal);
        } else if (saving.getSavingType() == SavingType.SIMPLE_INTEREST || saving.getSavingType() == SavingType.INTEREST_RETURN_WALLET) {
            expectedInterest = principal.multiply(rate).multiply(BigDecimal.valueOf(periodsBetween));
        }

        // Nếu có thể thì cần cải thiện thuật toán thêm cho một số trường hợp khác

        return expectedInterest.setScale(2, RoundingMode.HALF_UP);
    }

    private long calculatePeriodsBetween(LocalDate startDate, LocalDate currentDate, ReceiveInterestTime period) {
        switch (period) {
            case DAILY:
                return ChronoUnit.DAYS.between(startDate, currentDate);
            case WEEKLY:
                return ChronoUnit.WEEKS.between(startDate, currentDate);
            case MONTHLY:
                return ChronoUnit.MONTHS.between(startDate, currentDate);
            case EVERY_TWO_MONTH:
                return (ChronoUnit.MONTHS.between(startDate, currentDate))/2;
            case EVERY_THREE_MONTH:
                return (ChronoUnit.MONTHS.between(startDate, currentDate))/3;
            case EVERY_SIX_MONTH:
                return (ChronoUnit.MONTHS.between(startDate, currentDate))/6;
            case YEARLY:
                return ChronoUnit.YEARS.between(startDate, currentDate);
            default:
                throw new IllegalArgumentException("Unknown period: " + period);
        }
    }

    // Người dùng sẽ lựa chọn sử dụng kết quả tính toán hay không
    // Nếu đồng ý thì sử dụng, còn không thì tự update tay. Khi user đồng ý thì gọi hàm tính interest.

    // Expected amount sẽ là giá trị lưu giữ số tiền dự kiến ở cuối chu kỳ lãi với type "COMPOUND".
    // Ví dụ như ban đầu saving có 1000USD, lãi 1% thì expected amount cuối chu kỳ là 1010USD
    // Nếu giữa chu kỳ có thêm 100USD chuyển vào thì current amount và expected amount đều được tăng lên từng đó
    // Nghĩa là expected amount sẽ là 1110USD.

    // Tiếp theo là hàm tính lãi kép, ý tưởng cho hàm này là dựa vào startDate và currentAmount
    // cùng với interestRate và repeatedTime (Tháng, Năm, Tuần,...)
    // Ví dụ startDate là 01/05, MONTHLY, 1% mỗi Month, currentAmount là 1000USD.
    // Vậy thì ngay khi đó sẽ tính toán expectedAmount 1010USD vào cuối chu kỳ.
    // Trong lúc đó người dùng chỉnh sửa tỉ lệ lên 2% nhưng vẫn giữa nguyên startDate chẳng hạn
    // expectedAmount cũng sẽ đuợc tính toán lại. Và nếu
}
