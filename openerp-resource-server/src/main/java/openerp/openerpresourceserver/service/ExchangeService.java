package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.dto.ExchangeDTO;
import openerp.openerpresourceserver.dto.request.BudgetGraphRequest;
import openerp.openerpresourceserver.dto.response.BudgetGraphResponse;
import openerp.openerpresourceserver.dto.response.OverviewExchangeBudgetDTO;
import openerp.openerpresourceserver.dto.response.OverviewWalletDTO;
import openerp.openerpresourceserver.dto.SavingHistoryDTO;
import openerp.openerpresourceserver.entity.Exchange;
import openerp.openerpresourceserver.dto.response.SavingOverviewGraphResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface ExchangeService {
    List<Exchange> getAllExchanges();

    List<Exchange> getAllExchangesByUserId(String userId);

    List<Exchange> createWalletToWalletExchange(ExchangeDTO exchangeDTO);

    List<Exchange> createIncomeExchange(ExchangeDTO exchangeDTO);

    List<Exchange> createSpendExchange(ExchangeDTO exchangeDTO);

    Exchange getExchangeById(UUID exchangeId);

    List<Exchange> deleteExchange(String userId, UUID exchangeId);

    List<Exchange> updateExchange(ExchangeDTO exchangeDTO, UUID exchangeId);

    String uploadImage(MultipartFile file) throws IOException;

    List<Exchange> getAllExchangeByWallet(UUID id);

    List<Exchange> getExchangesByBudget(UUID budgetId);

    List<Exchange> getExchangesByBudgetInOneMonth(String userId);

    List<Exchange> createWalletSavingExchange(ExchangeDTO exchangeDTO);

    List<Exchange> getAllExchangeByExchangeType(String type);

    List<Exchange> getAllExchangesBySavingId(UUID savingId);

    List<SavingHistoryDTO> getAllSavingHistory(UUID savingId);

    List<OverviewWalletDTO> getWalletChangesInLast30Days(String userId);

    List<OverviewExchangeBudgetDTO> getExchangeBudgetChanges(String userId);

    List<Exchange> getAllLast30daysUserExchanges(String userId);

    List<BudgetGraphResponse> getBudgetExchangesDataGraph(BudgetGraphRequest request);

    SavingOverviewGraphResponse getSavingOverviewInOneMonth(String userId);

    List<Exchange> createWalletLoanExchange(ExchangeDTO exchangeDTO);

    List<Exchange> createWalletDebtExchange(ExchangeDTO exchangeDTO);
}
