package openerp.openerpresourceserver.service;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.DebtDTO;
import openerp.openerpresourceserver.dto.LoanDTO;
import openerp.openerpresourceserver.dto.ExchangeDTO;
import openerp.openerpresourceserver.dto.request.DebtLoanChangeStatusRequest;
import openerp.openerpresourceserver.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TransactionService {
    private SavingService savingService;
    private ExchangeService exchangeService;
    private LoanAndDebtService loanAndDebtService;
    private WalletService walletService;

    @Transactional
    public List<Saving> removeSavingWithExchanges(UUID savingId) {
        Saving saving = savingService.getBySavingId(savingId);
        String userId = saving.getUser().getUserId();

        // Xóa tất cả các Exchange liên quan đến Saving
        List<Exchange> relatedExchanges = exchangeService.getAllExchangesBySavingId(savingId);
        for (Exchange exchange : relatedExchanges) {
            exchangeService.deleteExchange(userId, exchange.getExchangeId());
        }

        // Sau khi xóa tất cả Exchange liên quan, xóa Saving
        return savingService.removeSaving(savingId);
    }
    @Transactional
    public List<Loan> createNewLoan(LoanDTO loanDTO) {
        Loan loan = loanAndDebtService.createNewLoan(loanDTO);

        if(loanDTO.getIsCreateExchange()) {
            ExchangeDTO exchangeDTO = new ExchangeDTO();
            exchangeDTO.setUserId(loanDTO.getUserId());
            exchangeDTO.setWalletId(loanDTO.getWalletId());
            exchangeDTO.setAmount(loanDTO.getOriginAmount());
            exchangeDTO.setDestinationId(loan.getLoanId());
            exchangeDTO.setTo(loan.getName());
            exchangeDTO.setDescription(loanDTO.getDescription());
            exchangeDTO.setExchangeTypeId("wallet_loan");
            OffsetDateTime exchangeDate = loanDTO.getStartDate().toInstant()
                    .atOffset(ZoneOffset.UTC);
            exchangeDTO.setExchangeDate(exchangeDate);
            exchangeService.createWalletLoanExchange(exchangeDTO);
        }

        return loanAndDebtService.getAllLoanByUserId(loanDTO.getUserId());
    }
    @Transactional
    public List<Debt> createNewDebt(DebtDTO debtDTO) {
        Debt debt = loanAndDebtService.createNewDebt(debtDTO);

        if(debtDTO.getIsCreateExchange()) {
            ExchangeDTO exchangeDTO = new ExchangeDTO();
            exchangeDTO.setUserId(debtDTO.getUserId());
            exchangeDTO.setWalletId(debtDTO.getWalletId());
            exchangeDTO.setAmount(debtDTO.getOriginAmount());
            exchangeDTO.setDestinationId(debt.getDebtId());
            exchangeDTO.setFrom(debt.getName());
            exchangeDTO.setDescription(debtDTO.getDescription());
            exchangeDTO.setExchangeTypeId("debt_wallet");
            OffsetDateTime exchangeDate = debtDTO.getStartDate().toInstant()
                    .atOffset(ZoneOffset.UTC);;
            exchangeDTO.setExchangeDate(exchangeDate);
            exchangeService.createWalletDebtExchange(exchangeDTO);
        }

        return loanAndDebtService.getAllDebtByUserId(debtDTO.getUserId());

    }

    public List<Loan> updateStatusLoanAndCreateExchangeBack(DebtLoanChangeStatusRequest request, UUID loanId) throws IllegalAccessException {
        Loan loan = loanAndDebtService.updateStatusLoan(loanId);
        String userId = loan.getUser().getUserId();
        UUID walletId = request.getWalletId();
        Wallet wallet = walletService.getWalletById(walletId);
        String exchangeTypeId = request.getExchangeTypeId();

        ExchangeDTO exchangeDTO = new ExchangeDTO();
        exchangeDTO.setUserId(userId);
        exchangeDTO.setWalletId(walletId);
        exchangeDTO.setAmount(loan.getCurrentAmount());
        exchangeDTO.setDestinationId(loan.getLoanId());
        exchangeDTO.setTo(loan.getName());
        exchangeDTO.setDescription(request.getDescription());
        exchangeDTO.setExchangeTypeId("loan_wallet");
        OffsetDateTime exchangeDate = new Date().toInstant()
                .atOffset(ZoneOffset.UTC);
        exchangeDTO.setExchangeDate(exchangeDate);
        exchangeService.createWalletLoanExchange(exchangeDTO);
        return loanAndDebtService.getAllLoanByUserId(userId);
    }

    public List<Debt> updateStatusDebtAndCreateExchangeBack(DebtLoanChangeStatusRequest request, UUID debtId) throws IllegalAccessException {
        Debt debt = loanAndDebtService.updateStatusDebt(debtId);
        String userId = debt.getUser().getUserId();
        UUID walletId = request.getWalletId();
        Wallet wallet = walletService.getWalletById(walletId);
        String exchangeTypeId = request.getExchangeTypeId();

        ExchangeDTO exchangeDTO = new ExchangeDTO();
        exchangeDTO.setUserId(userId);
        exchangeDTO.setWalletId(walletId);
        exchangeDTO.setAmount(debt.getCurrentAmount());
        exchangeDTO.setDestinationId(debt.getDebtId());
        exchangeDTO.setFrom(debt.getName());
        exchangeDTO.setDescription(request.getDescription());
        exchangeDTO.setExchangeTypeId("wallet_debt");
        OffsetDateTime exchangeDate = new Date().toInstant()
                .atOffset(ZoneOffset.UTC);
        exchangeDTO.setExchangeDate(exchangeDate);
        exchangeService.createWalletDebtExchange(exchangeDTO);
        return loanAndDebtService.getAllDebtByUserId(userId);
    }
}
