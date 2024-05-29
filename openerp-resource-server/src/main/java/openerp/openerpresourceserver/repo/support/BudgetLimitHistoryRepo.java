package openerp.openerpresourceserver.repo.support;

import openerp.openerpresourceserver.entity.support.BudgetCategory;
import openerp.openerpresourceserver.entity.support.BudgetLimitHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BudgetLimitHistoryRepo extends JpaRepository<BudgetLimitHistory, UUID> {
    List<BudgetLimitHistory> findByBudgetCategory_BudgetCategoryId(UUID budgetCategoryId);
//    List<BudgetLimitHistory> findByBudgetCategoryAndEffectiveDateBetween(BudgetCategory budgetCategory, LocalDate startDate, LocalDate endDate);
}
