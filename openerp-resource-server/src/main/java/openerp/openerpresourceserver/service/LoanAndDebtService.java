package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.dto.DebtDTO;
import openerp.openerpresourceserver.dto.LoanDTO;
import openerp.openerpresourceserver.entity.Debt;
import openerp.openerpresourceserver.entity.Loan;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface LoanAndDebtService {
    List<Loan> getAllLoan();

    List<Debt> getAllDebt();

    List<Loan> getAllLoanByUserId(String userId);

    Loan getLoanById(UUID loanId);

    Debt getDebtById(UUID debtId);

    List<Debt> getAllDebtByUserId(String userId);

    Loan createNewLoan(LoanDTO loanDTO);

    Debt createNewDebt(DebtDTO debtDTO);

    Loan updateLoanAfterUpdateExchange(UUID loanId, BigDecimal amount);

    Debt updateDebtAfterUpdateExchange(UUID debtId, BigDecimal amount);

    List<Loan> removeLoanAccount(UUID destinationId);

    List<Debt> removeDebtAccount(UUID destinationId);

    Loan updateLoan(LoanDTO loanDTO, UUID loanId);

    Debt updateDebt(DebtDTO debtDTO, UUID debtId);

    Loan updateStatusLoan(UUID loanId) throws IllegalAccessException;

    Debt updateStatusDebt(UUID debtId) throws IllegalAccessException;
}
