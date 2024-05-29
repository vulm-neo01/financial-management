package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.dto.BudgetLimitDTO;
import openerp.openerpresourceserver.entity.support.BudgetLimitHistory;

import java.util.List;
import java.util.UUID;

public interface BudgetLimitHistoryService {
    List<BudgetLimitHistory> getBudgetLimitsByCategory(UUID categoryId);

    List<BudgetLimitHistory> createBudgetLimit(BudgetLimitDTO budgetLimitDTO);
}
