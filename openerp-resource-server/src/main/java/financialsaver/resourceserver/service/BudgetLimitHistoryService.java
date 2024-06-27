package financialsaver.resourceserver.service;

import financialsaver.resourceserver.dto.BudgetLimitDTO;
import financialsaver.resourceserver.entity.support.BudgetLimitHistory;

import java.util.List;
import java.util.UUID;

public interface BudgetLimitHistoryService {
    List<BudgetLimitHistory> getBudgetLimitsByCategory(UUID categoryId);

    List<BudgetLimitHistory> createBudgetLimit(BudgetLimitDTO budgetLimitDTO);
}
