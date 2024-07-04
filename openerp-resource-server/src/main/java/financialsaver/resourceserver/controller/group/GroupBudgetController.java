package financialsaver.resourceserver.controller.group;

import financialsaver.resourceserver.dto.GroupBudgetDTO;
import lombok.AllArgsConstructor;
import financialsaver.resourceserver.entity.group.GroupBudget;
import financialsaver.resourceserver.entity.group.GroupWallet;
import financialsaver.resourceserver.service.GroupBudgetService;
import financialsaver.resourceserver.service.GroupWalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/group/budgets")
@AllArgsConstructor(onConstructor_ = @Autowired)
public class GroupBudgetController {
    private GroupBudgetService groupBudgetService;
    private GroupWalletService groupWalletService;
    @GetMapping
    public ResponseEntity<?> getAll(){
        List<GroupBudget> groupBudgets = groupBudgetService.findAll();
        return ResponseEntity.ok().body(groupBudgets);
    }

    @GetMapping("/all/{groupWalletId}")
    public ResponseEntity<?> getAllByGroupWalletID(@PathVariable UUID groupWalletId){
        List<GroupBudget> groupBudgets = groupBudgetService.findAllByGroupWalletID(groupWalletId);
        return ResponseEntity.ok().body(groupBudgets);
    }

    @GetMapping("/{groupBudgetId}")
    public ResponseEntity<?> getById(@PathVariable UUID groupBudgetId){
        GroupBudget groupBudget = groupBudgetService.findById(groupBudgetId);
        return ResponseEntity.ok().body(groupBudget);
    }

    @PostMapping
    public ResponseEntity<?> createNewGrBudget(@RequestBody GroupBudgetDTO groupBudgetDTO) throws IllegalAccessException {
        GroupWallet groupWallet = groupWalletService.getById(groupBudgetDTO.getGroupWalletId());

        List<GroupBudget> groupBudgets = groupBudgetService.createGroupBudget(groupBudgetDTO, groupWallet);
        return ResponseEntity.ok().body(groupBudgets);
    }

    @PatchMapping("/{groupBudgetId}")
    public ResponseEntity<?> updateGrBudget(@RequestBody GroupBudgetDTO groupBudgetDTO, @PathVariable UUID groupBudgetId) throws IllegalAccessException {
        GroupWallet groupWallet = groupWalletService.getById(groupBudgetDTO.getGroupWalletId());

        List<GroupBudget> groupBudgets = groupBudgetService.updateGroupBudget(groupBudgetDTO, groupWallet, groupBudgetId);
        return ResponseEntity.ok().body(groupBudgets);
    }

    @PatchMapping("/delete/{groupBudgetId}")
    public ResponseEntity<?> deleteBudget(@RequestBody GroupBudgetDTO groupBudgetDTO, @PathVariable UUID groupBudgetId) throws IllegalAccessException {
        List<GroupBudget> groupBudgets = groupBudgetService.deleteBudget(groupBudgetDTO, groupBudgetId);
        return ResponseEntity.ok().body(groupBudgets);
    }
}
