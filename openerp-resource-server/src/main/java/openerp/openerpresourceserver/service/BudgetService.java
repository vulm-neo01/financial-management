package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.dto.BudgetCreateDTO;
import openerp.openerpresourceserver.entity.UserInfo;
import openerp.openerpresourceserver.entity.support.BudgetCategory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetService {
    List<BudgetCategory> getAllBudgets();

    List<BudgetCategory> getAllBudgetsByType(String type);


    Optional<BudgetCategory> getBudgetById(String id);

    List<BudgetCategory> getAllBudgetsByUserId(String userId);

    List<BudgetCategory> getAllBudgetIncome(String userId);

    List<BudgetCategory> getAllBudgetSpend(String userId);

    List<BudgetCategory> createNewBudget(BudgetCreateDTO budgetCreateDTO);

    void getPredefinedList(UserInfo userInfo);

    BudgetCategory updateBudget(BudgetCreateDTO budgetCreateDTO, String budgetId);

    void deleteBudget(UUID budgetId);
}
