package openerp.openerpresourceserver.service.impl;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.BudgetLimitDTO;
import openerp.openerpresourceserver.entity.support.BudgetCategory;
import openerp.openerpresourceserver.entity.support.BudgetLimitHistory;
import openerp.openerpresourceserver.repo.support.BudgetLimitHistoryRepo;
import openerp.openerpresourceserver.service.BudgetLimitHistoryService;
import openerp.openerpresourceserver.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
public class BudgetLimitHistoryServiceImpl implements BudgetLimitHistoryService {

    private BudgetLimitHistoryRepo budgetLimitHistoryRepo;
    private BudgetService budgetService;

    @Override
    public List<BudgetLimitHistory> getBudgetLimitsByCategory(UUID categoryId) {
        return budgetLimitHistoryRepo.findByBudgetCategory_BudgetCategoryId(categoryId);
    }

    @Override
    public List<BudgetLimitHistory> createBudgetLimit(BudgetLimitDTO budgetLimitDTO) {
        BudgetLimitHistory budgetLimitHistory = new BudgetLimitHistory();
        BudgetCategory category = budgetService.getBudgetById(budgetLimitDTO.getCategoryId().toString()).orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));
        budgetLimitHistory.setBudgetCategory(category);
        budgetLimitHistory.setEffectiveDate(budgetLimitDTO.getEffectiveDate());
        budgetLimitHistory.setLimitAmount(budgetLimitDTO.getLimitAmount());
        budgetLimitHistoryRepo.save(budgetLimitHistory);
        return getBudgetLimitsByCategory(budgetLimitDTO.getCategoryId());
    }
}
