package financialsaver.resourceserver.service.impl;

import financialsaver.resourceserver.dto.GroupWalletDTO;
import financialsaver.resourceserver.service.*;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import financialsaver.resourceserver.entity.group.GroupMember;
import financialsaver.resourceserver.entity.group.GroupWallet;
import financialsaver.resourceserver.repo.group.GroupWalletRepo;
import financialsaver.resourceserver.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
public class GroupWalletServiceImpl implements GroupWalletService {
    private GroupWalletRepo groupWalletRepo;
    private GroupBudgetService groupBudgetService;
    private GroupMemberService groupMemberService;
    private LogoService logoService;
    private UserInfoService userInfoService;
    @Override
    public List<GroupWallet> getAllByUserId(String userId) {
        List<GroupMember> groupMembers = groupMemberService.findAllByUserId(userId);
        List<GroupWallet> groupWallets = groupMembers.stream()
                .map(GroupMember::getWallet)
                .filter(groupWallet -> groupWallet.getIsActive().equals(true))
                .collect(Collectors.toList());
        return groupWallets;
    }

    @Override
    public GroupWallet getById(UUID groupWalletId) {
        return groupWalletRepo.findById(groupWalletId)
                .orElseThrow(() -> new IllegalArgumentException("Group Wallet is not existed!"));
    }

    @Override
    public List<GroupWallet> createNewGroupWallet(GroupWalletDTO groupWalletDTO) {
        UUID walletId = UUID.randomUUID();
        GroupWallet groupWallet = GroupWallet.builder()
                .logo(logoService.getLogoById(groupWalletDTO.getLogoId()))
                .description(groupWalletDTO.getDescription())
                .owner(userInfoService.getUserById(groupWalletDTO.getOwnerId()))
                .groupName(groupWalletDTO.getGroupName())
                .createdAt(new Date())
                .updatedAt(new Date())
                .amount(groupWalletDTO.getAmount())
                .isActive(true)
                .groupWalletId(walletId)
                .build();

        groupWallet = groupWalletRepo.save(groupWallet);
        groupBudgetService.createGroupBudgetDefault(groupWallet);
        groupMemberService.createGroupMemberAdmin(groupWallet);

        return getAllByUserId(groupWalletDTO.getOwnerId());
    }

    @Override
    public GroupWallet updateGroupWallet(GroupWalletDTO groupWalletDTO, UUID groupWalletId) throws IllegalAccessException {
        String userId = groupWalletDTO.getOwnerId();
        if(!groupMemberService.IsAdminOfGroupWallet(userId, groupWalletId)){
            throw new IllegalAccessException("Member can't change Wallet properties!");
        };

        GroupWallet groupWallet = getById(groupWalletId);
        groupWallet.setGroupName(groupWalletDTO.getGroupName());
        groupWallet.setUpdatedAt(new Date());
        groupWallet.setDescription(groupWalletDTO.getDescription());
        groupWallet.setAmount(groupWalletDTO.getAmount());
        groupWallet.setLogo(logoService.getLogoById(groupWalletDTO.getLogoId()));


        return groupWalletRepo.save(groupWallet);
    }

//    @Override
//    public void UpdateAfterCreatedExchange(BigDecimal amount, UUID groupWalletId) {
//        GroupWallet groupWallet = getById(groupWalletId);
//        groupWallet.setAmount(groupWallet.getAmount().add(amount));
//        groupWallet.setUpdatedAt(new Date());
//        groupWalletRepo.save(groupWallet);
//    }

    @Override
    public void UpdateAfterUpdatedExchange(BigDecimal amount, UUID groupWalletId) {
        GroupWallet groupWallet = getById(groupWalletId);
        groupWallet.setAmount(groupWallet.getAmount().add(amount));
        groupWallet.setUpdatedAt(new Date());
        groupWalletRepo.save(groupWallet);
    }

    @Override
    public List<GroupWallet> deleteGroupWallet(GroupWalletDTO groupWalletDTO, UUID groupWalletId) throws IllegalAccessException {
        String userId = groupWalletDTO.getOwnerId();
        if(!groupMemberService.IsAdminOfGroupWallet(userId, groupWalletId)){
            throw new IllegalAccessException("Member can't delete Wallet!");
        }

        GroupWallet groupWallet = getById(groupWalletId);
        groupWallet.setIsActive(false);
        groupWalletRepo.save(groupWallet);
        return getAllByUserId(userId);
    }
}
