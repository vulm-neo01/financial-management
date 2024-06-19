package openerp.openerpresourceserver.service.impl;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.DebtDTO;
import openerp.openerpresourceserver.dto.LoanDTO;
import openerp.openerpresourceserver.entity.Debt;
import openerp.openerpresourceserver.entity.Loan;
import openerp.openerpresourceserver.entity.support.LoanDebtType;
import openerp.openerpresourceserver.repo.DebtRepo;
import openerp.openerpresourceserver.repo.LoanRepo;
import openerp.openerpresourceserver.service.ColorService;
import openerp.openerpresourceserver.service.LoanAndDebtService;
import openerp.openerpresourceserver.service.UserInfoService;
import openerp.openerpresourceserver.utils.time.CalculateTimes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
@Log4j2
public class LoanAndDebtServiceImpl implements LoanAndDebtService {
    private DebtRepo debtRepo;
    private LoanRepo loanRepo;
    private ColorService colorService;
    private UserInfoService userInfoService;

    @Override
    public List<Loan> getAllLoan() {
        return loanRepo.findAll();
    }

    @Override
    public List<Debt> getAllDebt() {
        return debtRepo.findAll();
    }

    @Override
    public List<Loan> getAllLoanByUserId(String userId) {
        List<Loan> loans = loanRepo.findAllByUser_UserId(userId);
        return loans;
    }

    @Override
    public Loan getLoanById(UUID loanId) {
        return loanRepo.findById(loanId)
                .orElseThrow(() -> new NoSuchElementException("Not exist loan with id " + loanId));
    }

    @Override
    public Debt getDebtById(UUID debtId) {
        return debtRepo.findById(debtId)
                .orElseThrow(() -> new NoSuchElementException("Not exist debt with id " + debtId));
    }

    @Override
    public List<Debt> getAllDebtByUserId(String userId) {
        List<Debt> debts = debtRepo.findAllByUser_UserId(userId);
        return debts;
    }

    @Override
    public Loan createNewLoan(LoanDTO loanDTO) {
        String userId = loanDTO.getUserId();

        Loan loan = Loan.builder()
                .loanId(UUID.randomUUID())
                .user(userInfoService.getUserById(userId))
                .name(loanDTO.getName())
                .color(colorService.getById(loanDTO.getColorId()))
                .description(loanDTO.getDescription())
                .originAmount(loanDTO.getOriginAmount())
                .type(loanDTO.getType())
                .receiveInterestTime(loanDTO.getReceiveInterestTime())
                .interestRate(loanDTO.getInterestRate())
                .startDate(loanDTO.getStartDate())
                .changeDate(loanDTO.getStartDate())
                .returnDate(loanDTO.getReturnDate())
                .openStatus(true)
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();

        loan.setExpectedInterestAmount(calculateExpectedInterest(loan));
        loan.setCurrentAmount(loan.getExpectedInterestAmount().add(loan.getOriginAmount()));

        return loanRepo.save(loan);
    }

    @Override
    public Debt createNewDebt(DebtDTO debtDTO) {
        String userId = debtDTO.getUserId();

        Debt debt = Debt.builder()
                .debtId(UUID.randomUUID())
                .user(userInfoService.getUserById(userId))
                .name(debtDTO.getName())
                .color(colorService.getById(debtDTO.getColorId()))
                .description(debtDTO.getDescription())
                .originAmount(debtDTO.getOriginAmount())
                .type(debtDTO.getType())
                .receiveInterestTime(debtDTO.getReceiveInterestTime())
                .interestRate(debtDTO.getInterestRate())
                .startDate(debtDTO.getStartDate())
                .changeDate(debtDTO.getStartDate())
                .returnDate(debtDTO.getReturnDate())
                .openStatus(true)
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();

        debt.setExpectedInterestAmount(calculateExpectedInterest(debt));
        debt.setCurrentAmount(debt.getExpectedInterestAmount().add(debt.getOriginAmount()));

        return debtRepo.save(debt);
    }

    @Override
    public Loan updateLoanAfterUpdateExchange(UUID loanId, BigDecimal amount) {
        Loan loan = getLoanById(loanId);
        loan.setOriginAmount(amount);
        loan.setUpdatedAt(new Date());
        loan.setExpectedInterestAmount(calculateExpectedInterest(loan));
        loan.setCurrentAmount(loan.getExpectedInterestAmount().add(loan.getOriginAmount()));
        return loanRepo.save(loan);
    }

    @Override
    public Debt updateDebtAfterUpdateExchange(UUID debtId, BigDecimal amount) {
        Debt debt = getDebtById(debtId);
        debt.setOriginAmount(amount);
        debt.setUpdatedAt(new Date());
        debt.setExpectedInterestAmount(calculateExpectedInterest(debt));
        debt.setCurrentAmount(debt.getExpectedInterestAmount().add(debt.getOriginAmount()));
        return debtRepo.save(debt);
    }

    @Override
    public List<Loan> removeLoanAccount(UUID destinationId) {
        Loan loan = getLoanById(destinationId);
        String userId = loan.getUser().getUserId();
        loanRepo.delete(loan);
        return getAllLoanByUserId(userId);
    }

    @Override
    public List<Debt> removeDebtAccount(UUID destinationId) {
        Debt debt = getDebtById(destinationId);
        String userId = debt.getUser().getUserId();
        debtRepo.delete(debt);
        return getAllDebtByUserId(userId);
    }

    @Override
    public Loan updateLoan(LoanDTO loanDTO, UUID loanId) {
        Loan loan = getLoanById(loanId);

        loan.setColor(colorService.getById(loanDTO.getColorId()));
        loan.setName(loanDTO.getName());
        loan.setDescription(loan.getDescription());
        loan.setType(loan.getType());
        loan.setStartDate(loan.getStartDate());
        loan.setReturnDate(loan.getReturnDate());
        loan.setInterestRate(loan.getInterestRate());
        loan.setReceiveInterestTime(loanDTO.getReceiveInterestTime());
        loan.setOriginAmount(loanDTO.getOriginAmount());
        loan.setExpectedInterestAmount(calculateExpectedInterest(loan));
        loan.setCurrentAmount(loan.getExpectedInterestAmount().add(loan.getOriginAmount()));
        loan.setUpdatedAt(new Date());
        return loanRepo.save(loan);
    }

    @Override
    public Debt updateDebt(DebtDTO debtDTO, UUID debtId) {
        Debt debt = getDebtById(debtId);

        debt.setColor(colorService.getById(debtDTO.getColorId()));
        debt.setName(debtDTO.getName());
        debt.setDescription(debt.getDescription());
        debt.setType(debt.getType());
        debt.setStartDate(debt.getStartDate());
        debt.setReturnDate(debt.getReturnDate());
        debt.setInterestRate(debt.getInterestRate());
        debt.setReceiveInterestTime(debtDTO.getReceiveInterestTime());
        debt.setOriginAmount(debtDTO.getOriginAmount());
        debt.setExpectedInterestAmount(calculateExpectedInterest(debt));
        debt.setCurrentAmount(debt.getExpectedInterestAmount().add(debt.getOriginAmount()));
        debt.setUpdatedAt(new Date());
        return debtRepo.save(debt);
    }

    @Override
    public Loan updateStatusLoan(UUID loanId) throws IllegalAccessException {
        Loan loan = getLoanById(loanId);
        if(!loan.getOpenStatus()){
            throw new IllegalAccessException("Change can apply because loan already close!");
        }
        loan.setExpectedInterestAmount(calculateExpectedInterest(loan));
        loan.setCurrentAmount(loan.getExpectedInterestAmount().add(loan.getOriginAmount()));
        loan.setOpenStatus(false);
        return loanRepo.save(loan);
    }

    @Override
    public Debt updateStatusDebt(UUID debtId) throws IllegalAccessException {
        Debt debt = getDebtById(debtId);
        if(!debt.getOpenStatus()){
            throw new IllegalAccessException("Change can apply because debt already close!");
        }
        debt.setExpectedInterestAmount(calculateExpectedInterest(debt));
        debt.setCurrentAmount(debt.getExpectedInterestAmount().add(debt.getOriginAmount()));
        debt.setOpenStatus(false);
        return debtRepo.save(debt);
    }

    private BigDecimal calculateExpectedInterest(Loan loan) {
        if (loan.getType().equals(LoanDebtType.NO_INTEREST) || loan.getInterestRate() == null || loan.getStartDate() == null || loan.getReceiveInterestTime() == null) {
            return BigDecimal.ZERO;
        }
        LocalDate startDate = loan.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate endDate = LocalDate.now();
        BigDecimal principal = loan.getOriginAmount();
        BigDecimal annualRate = loan.getInterestRate();
        long divider = CalculateTimes.calculatePeriodsBetween(startDate, startDate.plusYears(1), loan.getReceiveInterestTime());
        BigDecimal rate = loan.getInterestRate().divide(BigDecimal.valueOf(100).multiply(BigDecimal.valueOf(divider)), 10, RoundingMode.HALF_UP);

        long periodsBetween = CalculateTimes.calculatePeriodsBetween(startDate, endDate, loan.getReceiveInterestTime());

        BigDecimal expectedInterest = BigDecimal.ZERO;

        if (loan.getType() == LoanDebtType.COMPOUND) {
            expectedInterest = principal.multiply(BigDecimal.ONE.add(rate).pow((int) periodsBetween)).subtract(principal);
        } else if (loan.getType() == LoanDebtType.SIMPLE_INTEREST) {
            expectedInterest = principal.multiply(rate).multiply(BigDecimal.valueOf(periodsBetween));
        }

        // Nếu có thể thì cần cải thiện thuật toán thêm cho một số trường hợp khác

        return expectedInterest.setScale(5, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateExpectedInterest(Debt debt) {
        if (debt.getType().equals(LoanDebtType.NO_INTEREST) || debt.getInterestRate() == null || debt.getStartDate() == null || debt.getReceiveInterestTime() == null) {
            return BigDecimal.ZERO;
        }
        LocalDate startDate = debt.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate endDate = LocalDate.now();
        BigDecimal principal = debt.getOriginAmount();
        BigDecimal annualRate = debt.getInterestRate();
        long divider = CalculateTimes.calculatePeriodsBetween(startDate, startDate.plusYears(1), debt.getReceiveInterestTime());
        BigDecimal rate = debt.getInterestRate().divide(BigDecimal.valueOf(100).multiply(BigDecimal.valueOf(divider)), 10, RoundingMode.HALF_UP);

        long periodsBetween = CalculateTimes.calculatePeriodsBetween(startDate, endDate, debt.getReceiveInterestTime());

        BigDecimal expectedInterest = BigDecimal.ZERO;

        if (debt.getType() == LoanDebtType.COMPOUND) {
            expectedInterest = principal.multiply(BigDecimal.ONE.add(rate).pow((int) periodsBetween)).subtract(principal);
        } else if (debt.getType() == LoanDebtType.SIMPLE_INTEREST) {
            expectedInterest = principal.multiply(rate).multiply(BigDecimal.valueOf(periodsBetween));
        }

        // Nếu có thể thì cần cải thiện thuật toán thêm cho một số trường hợp khác

        return expectedInterest.setScale(5, RoundingMode.HALF_UP);
    }
}
