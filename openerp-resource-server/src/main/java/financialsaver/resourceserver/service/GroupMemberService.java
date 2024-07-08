package financialsaver.resourceserver.service;

import financialsaver.resourceserver.dto.GroupMemberDTO;
import financialsaver.resourceserver.entity.group.GroupMember;
import financialsaver.resourceserver.entity.group.GroupWallet;

import java.util.List;
import java.util.UUID;

public interface GroupMemberService {
    List<GroupMember> findAll();
    GroupMember findById(UUID groupMemberId);

    void createGroupMemberAdmin(GroupWallet groupWallet);

    List<GroupMember> findAllByGroupWalletId(UUID groupWalletId);

    boolean IsAdminOfGroupWallet(String userId, UUID groupWalletId);

    List<GroupMember> addNewMember(GroupMemberDTO groupMemberDTO, GroupWallet groupWallet) throws IllegalAccessException;

    List<GroupMember> changeRole(GroupMemberDTO groupMemberDTO, UUID groupMemberId) throws IllegalAccessException;

    List<GroupMember> deleteFromGroup(GroupMemberDTO groupMemberDTO, UUID groupMemberId) throws IllegalAccessException;

    List<GroupMember> findAllByUserId(String userId);

    Boolean checkIsAdmin(String userId, UUID groupWalletId);

    List<GroupMember> outGroups(GroupMemberDTO groupMemberDTO);
}
