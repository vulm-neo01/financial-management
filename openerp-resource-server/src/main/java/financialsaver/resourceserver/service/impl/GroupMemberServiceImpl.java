package financialsaver.resourceserver.service.impl;

import financialsaver.resourceserver.entity.UserInfo;
import financialsaver.resourceserver.service.UserInfoService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import financialsaver.resourceserver.dto.GroupMemberDTO;
import financialsaver.resourceserver.entity.group.GroupMember;
import financialsaver.resourceserver.entity.group.GroupRole;
import financialsaver.resourceserver.entity.group.GroupWallet;
import financialsaver.resourceserver.repo.group.GroupMemberRepo;
import financialsaver.resourceserver.service.GroupMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
public class GroupMemberServiceImpl implements GroupMemberService {
    private GroupMemberRepo groupMemberRepo;
    private UserInfoService userInfoService;
    @Override
    public List<GroupMember> findAll() {
        return groupMemberRepo.findAll();
    }

    @Override
    public GroupMember findById(UUID groupMemberId) {
        return groupMemberRepo.findById(groupMemberId)
                .orElseThrow(() -> new IllegalArgumentException("Group Member is not exist!"));
    }

    @Override
    public void createGroupMemberAdmin(GroupWallet groupWallet) {
        GroupMember groupMember = GroupMember.builder()
                .groupMemberId(UUID.randomUUID())
                .joinedAt(new Date())
                .role(GroupRole.ADMIN)
                .user(groupWallet.getOwner())
                .wallet(groupWallet)
                .actionStatus(true)
                .build();

        groupMemberRepo.save(groupMember);
    }

    @Override
    public List<GroupMember> findAllByGroupWalletId(UUID groupWalletId) {
        return groupMemberRepo.findAllByWallet_GroupWalletId(groupWalletId)
                .stream().filter(
                        groupMember -> groupMember.getActionStatus().equals(true)
                ).collect(Collectors.toList());
    }

    @Override
    public boolean IsAdminOfGroupWallet(String userId, UUID groupWalletId) {
        List<GroupMember> groupMembers = findAllByGroupWalletId(groupWalletId);
        return groupMembers.stream()
                .anyMatch(member -> member.getUser().getUserId().equals(userId) && member.getRole() == GroupRole.ADMIN);
    }

    @Override
    public List<GroupMember> addNewMember(GroupMemberDTO groupMemberDTO, GroupWallet groupWallet) throws IllegalAccessException {
        if(!IsAdminOfGroupWallet(groupMemberDTO.getCreatedUserId(), groupMemberDTO.getGroupWalletId())){
            log.info("Group Create User ID: " + groupMemberDTO.getCreatedUserId());
            throw new IllegalAccessException("Only Admin can add new member");
        }

//        UserInfo user = userInfoService.getUserById(groupMemberDTO.getUserId());
        // Get user by username or email
        UserInfo user = userInfoService.getUserByUsernameOrEmail(groupMemberDTO.getUserId());

        // Check if user is null
        if (user == null) {
            log.info("User not found for identifier: " + groupMemberDTO.getUserId());
            return null; // or throw an exception if preferred
        }

        List<GroupMember> groupMemberList = findAllByGroupWalletId(groupWallet.getGroupWalletId());
        // Check if the user is already a member of the group
        for (GroupMember existingMember : groupMemberList) {
            if (existingMember.getUser().getUserId().equals(user.getUserId())) {
                // If the user is already a member, update the action status and save
                existingMember.setActionStatus(true);
                existingMember.setRole(groupMemberDTO.getRole());
                groupMemberRepo.save(existingMember);
                return findAllByGroupWalletId(groupWallet.getGroupWalletId());
            }
        }

        GroupMember groupMember = GroupMember.builder()
                .wallet(groupWallet)
                .groupMemberId(UUID.randomUUID())
                .user(user)
                .role(groupMemberDTO.getRole())
                .joinedAt(new Date())
                .actionStatus(true)
                .build();
        groupMemberRepo.save(groupMember);
        return findAllByGroupWalletId(groupWallet.getGroupWalletId());
    }

    @Override
    public List<GroupMember> changeRole(GroupMemberDTO groupMemberDTO, UUID groupMemberId) throws IllegalAccessException {
        if(!IsAdminOfGroupWallet(groupMemberDTO.getCreatedUserId(), groupMemberDTO.getGroupWalletId())){
            log.info("Group Create User ID: " + groupMemberDTO.getCreatedUserId());
            throw new IllegalAccessException("Only Admin can change role member");
        }

        GroupMember groupMember = findById(groupMemberId);
        if(groupMember.getRole().equals(GroupRole.MEMBER)){
            groupMember.setRole(GroupRole.ADMIN);
        } else {
            groupMember.setRole(GroupRole.MEMBER);
        }
        groupMemberRepo.save(groupMember);
        return findAllByGroupWalletId(groupMemberDTO.getGroupWalletId());
    }

    @Override
    public List<GroupMember> deleteFromGroup(GroupMemberDTO groupMemberDTO, UUID groupMemberId) throws IllegalAccessException {
        if(!IsAdminOfGroupWallet(groupMemberDTO.getCreatedUserId(), groupMemberDTO.getGroupWalletId())){
            log.info("Group Create User ID: " + groupMemberDTO.getCreatedUserId());
            throw new IllegalAccessException("Only Admin can delete member");
        }
        GroupMember groupMember = findById(groupMemberId);
        groupMember.setActionStatus(false);
        groupMemberRepo.save(groupMember);
        return findAllByGroupWalletId(groupMemberDTO.getGroupWalletId());
    }

    @Override
    public List<GroupMember> findAllByUserId(String userId) {
        return groupMemberRepo.findAllByUser_UserId(userId).stream().filter(
                groupMember -> groupMember.getActionStatus().equals(true)
        ).collect(Collectors.toList());
    }

    @Override
    public Boolean checkIsAdmin(String userId, UUID groupWalletId) {
        return IsAdminOfGroupWallet(userId, groupWalletId);
    }

    @Override
    public List<GroupMember> outGroups(GroupMemberDTO groupMemberDTO) {
        GroupMember groupMember = groupMemberRepo.findAllByWallet_GroupWalletId(groupMemberDTO.getGroupWalletId())
                .stream().filter(groupMember1 -> groupMember1.getUser().getUserId().equals(groupMemberDTO.getCreatedUserId()))
                .findFirst().orElseThrow(() -> new NoSuchElementException("Can't find group member"));
        groupMember.setActionStatus(false);
        groupMemberRepo.save(groupMember);
        return findAllByGroupWalletId(groupMemberDTO.getGroupWalletId());
    }
}
