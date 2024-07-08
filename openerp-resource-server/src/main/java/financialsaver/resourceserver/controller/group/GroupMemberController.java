package financialsaver.resourceserver.controller.group;

import lombok.AllArgsConstructor;
import financialsaver.resourceserver.dto.GroupMemberDTO;
import financialsaver.resourceserver.entity.group.GroupMember;
import financialsaver.resourceserver.entity.group.GroupWallet;
import financialsaver.resourceserver.service.GroupMemberService;
import financialsaver.resourceserver.service.GroupWalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/group/members")
@AllArgsConstructor(onConstructor_ = @Autowired)
public class GroupMemberController {
    private GroupMemberService groupMemberService;
    private GroupWalletService groupWalletService;
    @GetMapping
    public ResponseEntity<?> getAll(){
        List<GroupMember> groupMembers = groupMemberService.findAll();
        return ResponseEntity.ok().body(groupMembers);
    }

    @GetMapping("/check/{userId}/{groupWalletId}")
    public ResponseEntity<?> checkIsAdmin(@PathVariable String userId, @PathVariable UUID groupWalletId){
        Boolean isAdmin = groupMemberService.checkIsAdmin(userId, groupWalletId);
        return ResponseEntity.ok().body(isAdmin);
    }

    @GetMapping("/all/{groupWalletId}")
    public ResponseEntity<?> getAllByGroupWallet(@PathVariable UUID groupWalletId){
        List<GroupMember> groupMembers = groupMemberService.findAllByGroupWalletId(groupWalletId);
        return ResponseEntity.ok().body(groupMembers);
    }

    @GetMapping("/{groupMemberId}")
    public ResponseEntity<?> getById(@PathVariable UUID groupMemberId){
        GroupMember groupMember = groupMemberService.findById(groupMemberId);
        return ResponseEntity.ok().body(groupMember);
    }

    @PostMapping
    public ResponseEntity<?> addNewMember(@RequestBody GroupMemberDTO groupMemberDTO) throws IllegalAccessException {
        GroupWallet groupWallet = groupWalletService.getById(groupMemberDTO.getGroupWalletId());
        List<GroupMember> groupMembers = groupMemberService.addNewMember(groupMemberDTO, groupWallet);
        return ResponseEntity.ok().body(groupMembers);
    }

    @PatchMapping("/{groupMemberId}")
    public ResponseEntity<?> changeRoleOfMember(@RequestBody GroupMemberDTO groupMemberDTO, @PathVariable UUID groupMemberId) throws IllegalAccessException {
        List<GroupMember> groupMembers = groupMemberService.changeRole(groupMemberDTO, groupMemberId);
        return ResponseEntity.ok().body(groupMembers);
    }

    @PatchMapping("/delete-member/{groupMemberId}")
    public ResponseEntity<?> deleteMemberFromGroup(@RequestBody GroupMemberDTO groupMemberDTO, @PathVariable UUID groupMemberId) throws IllegalAccessException {
        List<GroupMember> groupMembers = groupMemberService.deleteFromGroup(groupMemberDTO, groupMemberId);
        return ResponseEntity.ok().body(groupMembers);
    }

    @PatchMapping("/out-group")
    public ResponseEntity<?> OutGroup(@RequestBody GroupMemberDTO groupMemberDTO) {
        List<GroupMember> groupMembers = groupMemberService.outGroups(groupMemberDTO);
        return ResponseEntity.ok().body(groupMembers);
    }
}
