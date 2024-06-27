package financialsaver.resourceserver.repo.support;

import financialsaver.resourceserver.entity.support.BudgetLimitHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BudgetLimitHistoryRepo extends JpaRepository<BudgetLimitHistory, UUID> {
    List<BudgetLimitHistory> findByBudgetCategory_BudgetCategoryId(UUID budgetCategoryId);
//    List<BudgetLimitHistory> findByBudgetCategoryAndEffectiveDateBetween(BudgetCategory budgetCategory, LocalDate startDate, LocalDate endDate);
}
