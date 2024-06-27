package financialsaver.resourceserver.controller.group;

import financialsaver.resourceserver.dto.GroupWalletDTO;
import lombok.AllArgsConstructor;
import financialsaver.resourceserver.entity.group.GroupWallet;
import financialsaver.resourceserver.service.GroupWalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/group/wallets")
@AllArgsConstructor(onConstructor_ = @Autowired)
public class GroupWalletController {
    private GroupWalletService groupWalletService;

    @GetMapping("/all/{userId}")
    public ResponseEntity<?> getAllByUserId(@PathVariable String userId){
        List<GroupWallet> groupWallets = groupWalletService.getAllByUserId(userId);
        return ResponseEntity.ok().body(groupWallets);
    }

    @GetMapping("/{groupWalletId}")
    public ResponseEntity<?> getById(@PathVariable UUID groupWalletId){
        GroupWallet groupWallet = groupWalletService.getById(groupWalletId);
        return ResponseEntity.ok().body(groupWallet);
    }

    @PostMapping
    public ResponseEntity<?> createNewGroupWallet(@RequestBody GroupWalletDTO groupWalletDTO){
        List<GroupWallet> groupWallets = groupWalletService.createNewGroupWallet(groupWalletDTO);
        return ResponseEntity.ok().body(groupWallets);
    }

    @PatchMapping("/{groupWalletId}")
    public ResponseEntity<?> updateGroupWallet(@RequestBody GroupWalletDTO groupWalletDTO, @PathVariable UUID groupWalletId) throws IllegalAccessException {
        GroupWallet groupWallet = groupWalletService.updateGroupWallet(groupWalletDTO, groupWalletId);
        return ResponseEntity.ok().body(groupWallet);
    }

    @PatchMapping("/delete/{groupWalletId}")
    public ResponseEntity<?> deleteGroupWallet(@RequestBody GroupWalletDTO groupWalletDTO, @PathVariable UUID groupWalletId) throws IllegalAccessException {
        List<GroupWallet> groupWallets = groupWalletService.deleteGroupWallet(groupWalletDTO, groupWalletId);
        return ResponseEntity.ok().body(groupWallets);
    }
}
