package openerp.openerpresourceserver.service.impl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.BudgetCreateDTO;
import openerp.openerpresourceserver.entity.UserInfo;
import openerp.openerpresourceserver.entity.support.BudgetCategory;
import openerp.openerpresourceserver.entity.support.BudgetLimitHistory;
import openerp.openerpresourceserver.entity.support.Logo;
import openerp.openerpresourceserver.repo.support.BudgetCategoryRepo;
import openerp.openerpresourceserver.repo.support.BudgetLimitHistoryRepo;
import openerp.openerpresourceserver.service.BudgetService;
import openerp.openerpresourceserver.service.LogoService;
import openerp.openerpresourceserver.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class BudgetServiceImpl implements BudgetService {
    private BudgetCategoryRepo budgetCategoryRepo;
    private BudgetLimitHistoryRepo budgetLimitHistoryRepo;
    private LogoService logoService;
    private UserInfoService userInfoService;

    @Override
    public List<BudgetCategory> getAllBudgets() {
        return budgetCategoryRepo.findByUserIsNull();
    }

    @Override
    public List<BudgetCategory> getAllBudgetsByType(String type) {
        return budgetCategoryRepo.findAllByType(type);
    }

    @Override
    public Optional<BudgetCategory> getBudgetById(String id) {
        UUID budgetId = UUID.fromString(id);
        return budgetCategoryRepo.findById(budgetId);
    }

    @Override
    public List<BudgetCategory> getAllBudgetsByUserId(String userId) {
//        List<BudgetCategory> ls = getAllBudgets();
        List<BudgetCategory> res = budgetCategoryRepo.findAllByUser_UserId(userId);
//        res.addAll(ls);
        return res;
    }

    @Override
    public List<BudgetCategory> getAllBudgetIncome(String userId) {
        List<BudgetCategory> ls = getAllBudgetsByUserId(userId);
        List<BudgetCategory> incomeBudgets = ls.stream()
                .filter(budgetCategory -> "income".equals(budgetCategory.getType()))
                .collect(Collectors.toList());
        return incomeBudgets;
    }

    @Override
    public List<BudgetCategory> getAllBudgetSpend(String userId) {
        List<BudgetCategory> ls = getAllBudgetsByUserId(userId);
        List<BudgetCategory> spendBudgets = ls.stream()
                .filter(budgetCategory -> !"income".equals(budgetCategory.getType()))
                .collect(Collectors.toList());
        return spendBudgets;
    }

    @Override
    public List<BudgetCategory> createNewBudget(BudgetCreateDTO budgetCreateDTO) {
        BudgetLimitHistory budgetLimitHistory = new BudgetLimitHistory();
        if(budgetCreateDTO.getLimitAmount() != null){
            budgetLimitHistory.setLimitAmount(budgetCreateDTO.getLimitAmount());
            budgetLimitHistory.setEffectiveDate(LocalDate.now());
        }

        Logo logo = logoService.getLogoById(budgetCreateDTO.getLogoId());
        UserInfo userInfo = userInfoService.getUserById(budgetCreateDTO.getUserId());
        List<BudgetLimitHistory> ls = new ArrayList<>();
        BudgetCategory budgetCategory = BudgetCategory.builder()
                .name(budgetCreateDTO.getName())
                .type(budgetCreateDTO.getType())
                .description(budgetCreateDTO.getDescription())
                .user(userInfo)
                .logo(logo)
                .budgetLimitHistories(ls)
                .build();
        BudgetCategory budget = budgetCategoryRepo.save(budgetCategory);

        budgetLimitHistory.setBudgetCategory(budget);
        ls.add(budgetLimitHistoryRepo.save(budgetLimitHistory));
        budget.setBudgetLimitHistories(ls);
        budgetCategoryRepo.save(budget);
        return getAllBudgetsByUserId(budgetCreateDTO.getUserId());
    }

    @Override
    public BudgetCategory updateBudget(BudgetCreateDTO budgetCreateDTO, String budgetId) {
        BudgetCategory budgetCategory = getBudgetById(budgetId).orElseThrow(IllegalArgumentException::new);
        Logo logo = logoService.getLogoById(budgetCreateDTO.getLogoId());
        List<BudgetLimitHistory> budgetLimitHistories = budgetCategory.getBudgetLimitHistories();

        BudgetLimitHistory budgetLimitHistory = new BudgetLimitHistory();
        if(budgetCreateDTO.getLimitAmount() != null){
            budgetLimitHistory.setLimitAmount(budgetCreateDTO.getLimitAmount());
            budgetLimitHistory.setEffectiveDate(LocalDate.now());
            budgetLimitHistory.setBudgetCategory(budgetCategory);
        }
        budgetLimitHistories.add(budgetLimitHistory);

        budgetCategory.setType(budgetCreateDTO.getType());
        budgetCategory.setName(budgetCreateDTO.getName());
        budgetCategory.setLogo(logo);
        budgetCategory.setDescription(budgetCreateDTO.getDescription());
        budgetCategory.setBudgetLimitHistories(budgetLimitHistories);

        return budgetCategoryRepo.save(budgetCategory);
    }

    @Override
    public void deleteBudget(UUID budgetId) {
        budgetCategoryRepo.deleteById(budgetId);
    }

    @Override
    public void getPredefinedList(UserInfo userInfo) {
        List<Logo> logos = logoService.getListPredefinedLogo();

        BudgetCategory budgetCategory1 = BudgetCategory.builder()
                .name("Food")
                .type("food_drink")
                .user(userInfo)
                .description("Budget for food expenses")
                .logo(logos.get(0))
                .budgetLimitHistories(new ArrayList<>()) // Initialize empty list
                .build();

        BudgetCategory budgetCategory2 = BudgetCategory.builder()
                .name("Drink")
                .type("food_drink")
                .user(userInfo)
                .description("Budget for drink expenses")
                .logo(logos.get(1))
                .budgetLimitHistories(new ArrayList<>()) // Initialize empty list
                .build();

        BudgetCategory budgetCategory3 = BudgetCategory.builder()
                .name("Shopping")
                .type("shopping")
                .user(userInfo)
                .description("Budget for shopping expenses")
                .logo(logos.get(2))
                .budgetLimitHistories(new ArrayList<>()) // Initialize empty list
                .build();

        BudgetCategory budgetCategory4 = BudgetCategory.builder()
                .name("Travel")
                .type("travel")
                .user(userInfo)
                .description("Budget for Travel expenses")
                .logo(logos.get(3))
                .budgetLimitHistories(new ArrayList<>()) // Initialize empty list
                .build();

        BudgetCategory budgetCategory5 = BudgetCategory.builder()
                .name("Family")
                .type("family")
                .user(userInfo)
                .description("Budget for Family expenses")
                .logo(logos.get(4))
                .budgetLimitHistories(new ArrayList<>()) // Initialize empty list
                .build();

        BudgetCategory budgetCategory6 = BudgetCategory.builder()
                .name("Entertainment")
                .type("entertainment")
                .user(userInfo)
                .description("Budget for Entertainment expenses")
                .logo(logos.get(5))
                .budgetLimitHistories(new ArrayList<>()) // Initialize empty list
                .build();

        BudgetCategory budgetCategory7 = BudgetCategory.builder()
                .name("House")
                .type("house")
                .user(userInfo)
                .description("Budget for House expenses")
                .logo(logos.get(6))
                .budgetLimitHistories(new ArrayList<>()) // Initialize empty list
                .build();

        BudgetCategory budgetCategory8 = BudgetCategory.builder()
                .name("Income")
                .type("income")
                .user(userInfo)
                .description("Budget for Income expenses")
                .logo(logos.get(7))
                .budgetLimitHistories(new ArrayList<>()) // Initialize empty list
                .build();

        BudgetCategory budgetCategory9 = BudgetCategory.builder()
                .name("Income")
                .type("income")
                .user(userInfo)
                .description("Budget for Income expenses")
                .logo(logos.get(8))
                .budgetLimitHistories(new ArrayList<>()) // Initialize empty list
                .build();

        BudgetCategory budgetCategory10 = BudgetCategory.builder()
                .name("Income")
                .type("income")
                .user(userInfo)
                .description("Budget for Income expenses")
                .logo(logos.get(9))
                .budgetLimitHistories(new ArrayList<>()) // Initialize empty list
                .build();

        budgetCategoryRepo.save(budgetCategory1);
        budgetCategoryRepo.save(budgetCategory2);
        budgetCategoryRepo.save(budgetCategory3);
        budgetCategoryRepo.save(budgetCategory4);
        budgetCategoryRepo.save(budgetCategory5);
        budgetCategoryRepo.save(budgetCategory6);
        budgetCategoryRepo.save(budgetCategory7);
        budgetCategoryRepo.save(budgetCategory8);
        budgetCategoryRepo.save(budgetCategory9);
        budgetCategoryRepo.save(budgetCategory10);
    }
}
