package openerp.openerpresourceserver.controller;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.*;
import openerp.openerpresourceserver.entity.Exchange;
import openerp.openerpresourceserver.dto.request.BudgetGraphRequest;
import openerp.openerpresourceserver.dto.request.DeleteRequest;
import openerp.openerpresourceserver.dto.response.BudgetGraphResponse;
import openerp.openerpresourceserver.dto.response.OverviewExchangeBudgetDTO;
import openerp.openerpresourceserver.dto.response.OverviewWalletDTO;
import openerp.openerpresourceserver.dto.response.SavingOverviewGraphResponse;
import openerp.openerpresourceserver.service.ExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/exchanges")
@Log4j2
public class ExchangeController {

    private ExchangeService exchangeService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllExchanges(){
        List<Exchange> exchanges = exchangeService.getAllExchanges();
        return ResponseEntity.ok().body(exchanges);
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<?> getAllUserExchanges(@PathVariable String userId){
        List<Exchange> exchanges = exchangeService.getAllExchangesByUserId(userId);
        return ResponseEntity.ok().body(exchanges);
    }

    @GetMapping("/all-last-30days/{userId}")
    public ResponseEntity<?> getAllLast30daysUserExchanges(@PathVariable String userId){
        List<Exchange> exchanges = exchangeService.getAllLast30daysUserExchanges(userId);
        return ResponseEntity.ok().body(exchanges);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExchangeById(@PathVariable UUID id){
        Exchange exchange = exchangeService.getExchangeById(id);
        return ResponseEntity.ok().body(exchange);
    }

    @GetMapping("/budget/{budgetId}")
    public ResponseEntity<?> getExchangeByBudget(@PathVariable UUID budgetId){
        List<Exchange> exchanges = exchangeService.getExchangesByBudget(budgetId);
        return ResponseEntity.ok().body(exchanges);
    }

    @GetMapping("/budget/user/{userId}")
    public ResponseEntity<?> getExchangeByBudgetInOneMonth(@PathVariable String userId){
        List<Exchange> exchanges = exchangeService.getExchangesByBudgetInOneMonth(userId);
        return ResponseEntity.ok().body(exchanges);
    }

    @PostMapping("/budget/graph-overview")
    public ResponseEntity<?> getExchangeByBudgetInOneMonth(@RequestBody BudgetGraphRequest request){
        List<BudgetGraphResponse> exchanges = exchangeService.getBudgetExchangesDataGraph(request);
        return ResponseEntity.ok().body(exchanges);
    }

    @PostMapping("/new_exchange")
    public ResponseEntity<?> createNewExchange(@RequestBody ExchangeDTO exchangeDTO){
        String exchangeType = exchangeDTO.getExchangeTypeId();
        List<Exchange> exchanges;
        switch (exchangeType.toLowerCase()) { // Use lowercase for case-insensitive matching
            case "wallet_wallet":
                exchanges = exchangeService.createWalletToWalletExchange(exchangeDTO);
                break;
            case "income":
                exchanges = exchangeService.createIncomeExchange(exchangeDTO);
                break;
            case "spend":
                exchanges = exchangeService.createSpendExchange(exchangeDTO);
                break;
//            case "loan_wallet":
            case "wallet_loan":
                exchanges = exchangeService.createWalletLoanExchange(exchangeDTO);
                break;
//            case "debt_wallet":
            case "wallet_debt":
                exchanges = exchangeService.createWalletDebtExchange(exchangeDTO);
                break;
            case "saving_wallet", "wallet_saving":
                exchanges = exchangeService.createWalletSavingExchange(exchangeDTO);
                break;
            default:
                // Handle invalid exchangeType (throw exception, return error response, etc.)
                throw new IllegalArgumentException("Invalid exchange type: " + exchangeType);
        }
        return ResponseEntity.ok().body(exchanges);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExchangeById(@RequestBody DeleteRequest deleteRequest, @PathVariable String id){
        try {
            UUID exchangeId = UUID.fromString(id);
            List<Exchange> savedExchanges = exchangeService.deleteExchange(deleteRequest.getUserId(), exchangeId);
            return ResponseEntity.ok(savedExchanges);
        } catch (IllegalArgumentException e) {
            // Xử lý ngoại lệ khi id không hợp lệ

            return ResponseEntity.badRequest().body("Invalid User ID or Exchange Id!");
        } catch (Exception e) {
            // Xử lý các ngoại lệ khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateExchangeById(@RequestBody ExchangeDTO exchangeDTO, @PathVariable String id){
        try {
            UUID exchangeId = UUID.fromString(id);
            List<Exchange> savedExchanges = exchangeService.updateExchange(exchangeDTO, exchangeId);
            return ResponseEntity.ok(savedExchanges);
        } catch (IllegalArgumentException e) {
            // Xử lý ngoại lệ khi id không hợp lệ
            return ResponseEntity.badRequest().body("Invalid User ID or Exchange Id!");
        } catch (Exception e) {
            // Xử lý các ngoại lệ khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        return new ResponseEntity<>(exchangeService.uploadImage(file), HttpStatus.OK);
    }

    @GetMapping("/wallet/{id}")
    public ResponseEntity<?> getExchangeByWallet(@PathVariable UUID id){
        List<Exchange> exchanges = exchangeService.getAllExchangeByWallet(id);
        return ResponseEntity.ok(exchanges);
    }

    @GetMapping("/wallet/last-30-days/{userId}")
    public ResponseEntity<List<OverviewWalletDTO>> getWalletChangesInLast30Days(@PathVariable String userId) {
        List<OverviewWalletDTO> changes = exchangeService.getWalletChangesInLast30Days(userId);
        return ResponseEntity.ok(changes);
    }

    @GetMapping("/overview/{userId}")
    public ResponseEntity<List<OverviewExchangeBudgetDTO>> getExchangeBudgetChanges(@PathVariable String userId) {
        List<OverviewExchangeBudgetDTO> changes = exchangeService.getExchangeBudgetChanges(userId);
        return ResponseEntity.ok(changes);
    }

    @GetMapping("/saving/{savingId}")
    public ResponseEntity<?> getExchangeByExchangeType(@PathVariable UUID savingId){
        List<Exchange> exchanges = exchangeService.getAllExchangesBySavingId(savingId);
        return ResponseEntity.ok(exchanges);
    }

    @GetMapping("/saving-history/{savingId}")
    public ResponseEntity<?> getSavingHistory(@PathVariable UUID savingId){
        List<SavingHistoryDTO> histories = exchangeService.getAllSavingHistory(savingId);
        return ResponseEntity.ok(histories);
    }

    @GetMapping("/saving-graph/{userId}")
    public ResponseEntity<?> getAllDataForSavingGraphOverview(@PathVariable String userId){
        SavingOverviewGraphResponse response = exchangeService.getSavingOverviewInOneMonth(userId);
        return ResponseEntity.ok(response);
    }
}
