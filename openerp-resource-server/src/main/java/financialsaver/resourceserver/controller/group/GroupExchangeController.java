package financialsaver.resourceserver.controller.group;

import lombok.AllArgsConstructor;
import financialsaver.resourceserver.dto.GroupExchangeDTO;
import financialsaver.resourceserver.entity.group.GroupExchange;
import financialsaver.resourceserver.entity.group.GroupWallet;
import financialsaver.resourceserver.service.GroupExchangeService;
import financialsaver.resourceserver.service.GroupWalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/group/exchanges")
@AllArgsConstructor(onConstructor_ = @Autowired)
public class GroupExchangeController {
    private GroupExchangeService groupExchangeService;
    private GroupWalletService groupWalletService;
    @GetMapping
    public ResponseEntity<?> getAll(){
        List<GroupExchange> groupExchanges = groupExchangeService.findAll();
        return ResponseEntity.ok().body(groupExchanges);
    }

    @GetMapping("/all/{groupWalletId}")
    public ResponseEntity<?> getAllByGroupWalletId(@PathVariable UUID groupWalletId){
        List<GroupExchange> groupExchanges = groupExchangeService.findAllByGroupWalletId(groupWalletId);
        return ResponseEntity.ok().body(groupExchanges);
    }
    @GetMapping("/{groupExchangeId}")
    public ResponseEntity<?> getById(@PathVariable UUID groupExchangeId){
        GroupExchange groupExchange = groupExchangeService.findById(groupExchangeId);
        return ResponseEntity.ok().body(groupExchange);
    }

    @PostMapping
    public ResponseEntity<?> createNewExchange(@RequestBody GroupExchangeDTO groupExchangeDTO){
        GroupWallet groupWallet = groupWalletService.getById(groupExchangeDTO.getGroupWalletId());
        List<GroupExchange> groupExchanges = groupExchangeService.createNewExchange(groupExchangeDTO, groupWallet);
        return ResponseEntity.ok().body(groupExchanges);
    }

    @PatchMapping("/{groupExchangeId}")
    public ResponseEntity<?> updateExchange(@RequestBody GroupExchangeDTO groupExchangeDTO, @PathVariable UUID groupExchangeId){
        GroupWallet groupWallet = groupWalletService.getById(groupExchangeDTO.getGroupWalletId());
        List<GroupExchange> groupExchanges = groupExchangeService.updateExchange(groupExchangeDTO, groupWallet, groupExchangeId);
        return ResponseEntity.ok().body(groupExchanges);
    }

    @DeleteMapping("/{groupExchangeId}")
    public ResponseEntity<?> deleteExchange(@PathVariable UUID groupExchangeId){
        List<GroupExchange> groupExchanges = groupExchangeService.deleteExchange(groupExchangeId);
        return ResponseEntity.ok().body(groupExchanges);
    }
}
