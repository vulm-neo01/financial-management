package financialsaver.resourceserver.controller;

import financialsaver.resourceserver.service.TransactionService;
import lombok.AllArgsConstructor;
import financialsaver.resourceserver.dto.DebtDTO;
import financialsaver.resourceserver.dto.LoanDTO;
import financialsaver.resourceserver.dto.request.PayDebtLoanRequest;
import financialsaver.resourceserver.entity.Debt;
import financialsaver.resourceserver.entity.Loan;
import financialsaver.resourceserver.service.LoanAndDebtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/loan-debt")
@AllArgsConstructor(onConstructor_ = @Autowired)
public class LoanAndDebtController {
    private LoanAndDebtService loanAndDebtService;
    private TransactionService transactionService;

    @GetMapping("/loan")
    public ResponseEntity<?> getAllLoan(){
        List<Loan> loans = loanAndDebtService.getAllLoan();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/debt")
    public ResponseEntity<?> getAllDebt(){
        List<Debt> debts = loanAndDebtService.getAllDebt();
        return ResponseEntity.ok(debts);
    }

    @GetMapping("/loan/user/{userId}")
    public ResponseEntity<?> getAllLoanByUserId(@PathVariable String userId){
        List<Loan> loans = loanAndDebtService.getAllLoanByUserId(userId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/loan/{loanId}")
    public ResponseEntity<?> getLoanById(@PathVariable UUID loanId){
        Loan loan = loanAndDebtService.getLoanById(loanId);
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/debt/{debtId}")
    public ResponseEntity<?> getDebtById(@PathVariable UUID debtId){
        Debt debt = loanAndDebtService.getDebtById(debtId);
        return ResponseEntity.ok(debt);
    }

    @GetMapping("/debt/user/{userId}")
    public ResponseEntity<?> getAllDebtByUserId(@PathVariable String userId){
        List<Debt> debts = loanAndDebtService.getAllDebtByUserId(userId);
        return ResponseEntity.ok(debts);
    }

    @GetMapping("/loan/total-amount/{userId}")
    public ResponseEntity<?> getLoanTotalAmountByUserId(@PathVariable String userId){
        BigDecimal totalAmount = loanAndDebtService.getLoanTotal(userId);
        return ResponseEntity.ok().body(totalAmount);
    }

    @GetMapping("/debt/total-amount/{userId}")
    public ResponseEntity<?> getDebtTotalAmountByUserId(@PathVariable String userId){
        BigDecimal totalAmount = loanAndDebtService.getDebtTotal(userId);
        return ResponseEntity.ok().body(totalAmount);
    }
    @PostMapping("/loan")
    public ResponseEntity<?> createLoan(@RequestBody LoanDTO loanDTO){
        List<Loan> loans = transactionService.createNewLoan(loanDTO);
        return ResponseEntity.ok(loans);
    }

    @PostMapping("/debt")
    public ResponseEntity<?> createDebt(@RequestBody DebtDTO debtDTO){
        List<Debt> debts = transactionService.createNewDebt(debtDTO);
        return ResponseEntity.ok(debts);
    }

    @DeleteMapping("/loan/{loanId}")
    public ResponseEntity<?> deleteLoan(@PathVariable UUID loanId){
        List<Loan> loans = loanAndDebtService.removeLoanAccount(loanId);
        return ResponseEntity.ok(loans);
    }

    @DeleteMapping("/debt/{debtId}")
    public ResponseEntity<?> deleteDebt(@PathVariable UUID debtId){
        List<Debt> debts = loanAndDebtService.removeDebtAccount(debtId);
        return ResponseEntity.ok(debts);
    }

    @PatchMapping("/loan/{loanId}")
    public ResponseEntity<?> updateLoan(@RequestBody LoanDTO loanDTO, @PathVariable UUID loanId){
        Loan loan = loanAndDebtService.updateLoan(loanDTO, loanId);
        return ResponseEntity.ok(loan);
    }

    @PatchMapping("/debt/{debtId}")
    public ResponseEntity<?> updateLoan(@RequestBody DebtDTO debtDTO, @PathVariable UUID debtId){
        Debt debt = loanAndDebtService.updateDebt(debtDTO, debtId);
        return ResponseEntity.ok(debt);
    }

    @PostMapping("/loan/change-status/{loanId}")
    public ResponseEntity<?> updateStatusLoan(@RequestBody PayDebtLoanRequest request, @PathVariable UUID loanId) throws IllegalAccessException {
        Loan loan = transactionService.updateStatusLoanAndCreateExchangeBack(request, loanId);
        return ResponseEntity.ok(loan);
    }

    @PostMapping("/debt/change-status/{debtId}")
    public ResponseEntity<?> updateStatusDebt(@RequestBody PayDebtLoanRequest request, @PathVariable UUID debtId) throws IllegalAccessException {
        Debt debt = transactionService.updateStatusDebtAndCreateExchangeBack(request, debtId);
        return ResponseEntity.ok(debt);
    }

    @PostMapping("/loan/pay/{loanId}")
    public ResponseEntity<?> payALoan(@RequestBody PayDebtLoanRequest request, @PathVariable UUID loanId) throws IllegalAccessException {
        Loan loan = transactionService.payForALoan(request, loanId);
        return ResponseEntity.ok(loan);
    }

    @PostMapping("/debt/pay/{debtId}")
    public ResponseEntity<?> payADebt(@RequestBody PayDebtLoanRequest request, @PathVariable UUID debtId) throws IllegalAccessException {
        Debt debt = transactionService.payForADebt(request, debtId);
        return ResponseEntity.ok(debt);
    }
}
