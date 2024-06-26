package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.Exchange;
import openerp.openerpresourceserver.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExchangeRepo extends JpaRepository<Exchange, UUID> {
    List<Exchange> findAllByUser_UserId(String userId);
    List<Exchange> findAllByWallet_WalletId(UUID walletId);
    List<Exchange> findAllByExchangeType_ExchangeTypeId(String typeId);

    List<Exchange> findAllByDestinationId(UUID destinationId);

    List<Exchange> findAllByExchangeDateBetween(OffsetDateTime start, OffsetDateTime end);

    List<Exchange> findAllByCategory_BudgetCategoryId(UUID categoryId);

    @Query("SELECT bc.budgetCategoryId, COALESCE(SUM(e.amount), 0) " +
            "FROM Exchange e " +
            "LEFT JOIN e.category bc " +
            "WHERE e.exchangeDate >= :startDate " +
            "GROUP BY bc.budgetCategoryId")
    List<Object[]> findMonthlySpending(LocalDateTime startDate);
}
