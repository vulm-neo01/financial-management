package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.dto.ExchangeDTO;
import openerp.openerpresourceserver.entity.Exchange;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface ExchangeService {
    List<Exchange> getAllExchanges();

    List<Exchange> getAllUserExchanges(String userId);

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

    List<Exchange> createSavingWalletExchange(ExchangeDTO exchangeDTO);
}
