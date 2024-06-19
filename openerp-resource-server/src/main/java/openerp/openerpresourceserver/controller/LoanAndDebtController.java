package openerp.openerpresourceserver.controller;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.dto.DebtDTO;
import openerp.openerpresourceserver.dto.LoanDTO;
import openerp.openerpresourceserver.dto.request.DebtLoanChangeStatusRequest;
import openerp.openerpresourceserver.entity.Debt;
import openerp.openerpresourceserver.entity.Loan;
import openerp.openerpresourceserver.service.LoanAndDebtService;
import openerp.openerpresourceserver.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/loan/{userId}")
    public ResponseEntity<?> getAllLoanByUserId(@PathVariable String userId){
        List<Loan> loans = loanAndDebtService.getAllLoanByUserId(userId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/debt/{userId}")
    public ResponseEntity<?> getAllDebtByUserId(@PathVariable String userId){
        List<Debt> debts = loanAndDebtService.getAllDebtByUserId(userId);
        return ResponseEntity.ok(debts);
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
    public ResponseEntity<?> updateStatusLoan(@RequestBody DebtLoanChangeStatusRequest request, @PathVariable UUID loanId) throws IllegalAccessException {
        List<Loan> loan = transactionService.updateStatusLoanAndCreateExchangeBack(request, loanId);
        return ResponseEntity.ok(loan);
    }

    @PostMapping("/debt/change-status/{debtId}")
    public ResponseEntity<?> updateStatusDebt(@RequestBody DebtLoanChangeStatusRequest request, @PathVariable UUID debtId) throws IllegalAccessException {
        List<Debt> debt = transactionService.updateStatusDebtAndCreateExchangeBack(request, debtId);
        return ResponseEntity.ok(debt);
    }
}
