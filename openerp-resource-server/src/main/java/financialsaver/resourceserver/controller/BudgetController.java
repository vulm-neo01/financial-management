package financialsaver.resourceserver.controller;

import financialsaver.resourceserver.entity.support.BudgetCategory;
import financialsaver.resourceserver.service.BudgetService;
import lombok.AllArgsConstructor;
import financialsaver.resourceserver.dto.BudgetCreateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/budgets")
@AllArgsConstructor(onConstructor_ = @Autowired)
public class BudgetController {
    private BudgetService budgetService;

//    @GetMapping
//    public ResponseEntity<?> getAllBudgets(){
//        List<BudgetCategory> budgets = budgetService.getAllBudgets();
//        return ResponseEntity.ok().body(budgets);
//    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBudgetById(@PathVariable String id){
        Optional<BudgetCategory> budget = budgetService.getBudgetById(id);
        return ResponseEntity.ok().body(budget);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<?> getAllBudgetsByType(@PathVariable String type){
        List<BudgetCategory> budgets = budgetService.getAllBudgetsByType(type);
        return ResponseEntity.ok().body(budgets);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAllBudgetsOfUser(@PathVariable String userId){
        List<BudgetCategory> budgets = budgetService.getAllBudgetsByUserId(userId);
        return ResponseEntity.ok().body(budgets);
    }

    @GetMapping("/income/{userId}")
    public ResponseEntity<?> getAllBudgetsIncome(@PathVariable String userId){
        List<BudgetCategory> budgets = budgetService.getAllBudgetIncome(userId);
        return ResponseEntity.ok().body(budgets);
    }

    @GetMapping("/spend/{userId}")
    public ResponseEntity<?> getAllBudgetsSpend(@PathVariable String userId){
        List<BudgetCategory> budgets = budgetService.getAllBudgetSpend(userId);
        return ResponseEntity.ok().body(budgets);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNewBudget(@RequestBody BudgetCreateDTO budgetCreateDTO){
        List<BudgetCategory> budgets = budgetService.createNewBudget(budgetCreateDTO);
        return ResponseEntity.ok().body(budgets);
    }

    @PatchMapping("/{budgetId}")
    public ResponseEntity<?> UpdateBudget(@RequestBody BudgetCreateDTO budgetCreateDTO, @PathVariable String budgetId){
        BudgetCategory budget = budgetService.updateBudget(budgetCreateDTO, budgetId);
        return ResponseEntity.ok().body(budget);
    }

    @DeleteMapping("/{budgetId}")
    public ResponseEntity<?> deleteBudget(@PathVariable UUID budgetId){
        budgetService.deleteBudget(budgetId);
        return ResponseEntity.ok().body("Delete Budget successful!");
    }
}
