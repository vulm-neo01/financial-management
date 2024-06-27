package financialsaver.resourceserver.service.impl;

import financialsaver.resourceserver.dto.GroupBudgetDTO;
import financialsaver.resourceserver.service.LogoService;
import financialsaver.resourceserver.service.UserInfoService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import financialsaver.resourceserver.entity.group.GroupBudget;
import financialsaver.resourceserver.entity.group.GroupWallet;
import financialsaver.resourceserver.repo.group.GroupBudgetRepo;
import financialsaver.resourceserver.service.GroupBudgetService;
import financialsaver.resourceserver.service.GroupMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
public class GroupBudgetServiceImpl implements GroupBudgetService {
    private GroupBudgetRepo groupBudgetRepo;
    private LogoService logoService;
    private GroupMemberService groupMemberService;
    private UserInfoService userInfoService;
    @Override
    public List<GroupBudget> findAll() {
        return groupBudgetRepo.findAll();
    }

    @Override
    public GroupBudget findById(UUID groupBudgetId) {
        return groupBudgetRepo.findById(groupBudgetId)
                .orElseThrow(() -> new IllegalArgumentException("Group Budget is not existed!"));
    }

    @Override
    public void createGroupBudgetDefault(GroupWallet groupWallet) {
        GroupBudget groupBudgetIncomeDefault = GroupBudget.builder()
                .groupBudgetId(UUID.randomUUID())
                .createdUser(null)
                .type("income")
                .description("Demo Income Budget")
                .groupWallet(groupWallet)
                .limitAmount(BigDecimal.valueOf(1000000))
                .logo(logoService.getLogoById("income_01"))
                .name("Demo Income Budget")
                .build();

        GroupBudget groupBudgetSpendDefault = GroupBudget.builder()
                .groupBudgetId(UUID.randomUUID())
                .createdUser(null)
                .type("spend")
                .description("Demo Spend Budget")
                .groupWallet(groupWallet)
                .limitAmount(BigDecimal.valueOf(1000000))
                .logo(logoService.getLogoById("food_00"))
                .name("Demo Spend Budget")
                .build();

        groupBudgetRepo.save(groupBudgetIncomeDefault);
        groupBudgetRepo.save(groupBudgetSpendDefault);
    }

    @Override
    public List<GroupBudget> findAllByGroupWalletID(UUID groupWalletId) {
        return groupBudgetRepo.findAllByGroupWallet_GroupWalletId(groupWalletId)
                .stream().filter(groupBudget -> groupBudget.getIsActive().equals(true))
                .collect(Collectors.toList());
    }

    @Override
    public List<GroupBudget> createGroupBudget(GroupBudgetDTO groupBudgetDTO, GroupWallet groupWallet) throws IllegalAccessException {
        if(!groupMemberService.IsAdminOfGroupWallet(groupBudgetDTO.getCreatedUserId(), groupBudgetDTO.getGroupWalletId())){
            log.info("Group Create User ID: " + groupBudgetDTO.getCreatedUserId());
            throw new IllegalAccessException("Only Admin can add new budget");
        }

        GroupBudget groupBudget = GroupBudget.builder()
                .name(groupBudgetDTO.getName())
                .logo(logoService.getLogoById(groupBudgetDTO.getLogoId()))
                .limitAmount(groupBudgetDTO.getLimitAmount())
                .groupWallet(groupWallet)
                .description(groupBudgetDTO.getDescription())
                .type(groupBudgetDTO.getType())
                .createdUser(userInfoService.getUserById(groupBudgetDTO.getCreatedUserId()))
                .groupBudgetId(UUID.randomUUID())
                .isActive(true)
                .build();
        groupBudgetRepo.save(groupBudget);
        return findAllByGroupWalletID(groupBudgetDTO.getGroupWalletId());
    }

    @Override
    public GroupBudget updateGroupBudget(GroupBudgetDTO groupBudgetDTO, GroupWallet groupWallet, UUID groupBudgetId) throws IllegalAccessException {
        if(!groupMemberService.IsAdminOfGroupWallet(groupBudgetDTO.getCreatedUserId(), groupBudgetDTO.getGroupWalletId())){
            log.info("Group Create User ID: " + groupBudgetDTO.getCreatedUserId());
            throw new IllegalAccessException("Only Admin can change a budget");
        }

        GroupBudget groupBudget = findById(groupBudgetId);
        groupBudget.setLogo(logoService.getLogoById(groupBudgetDTO.getLogoId()));
        groupBudget.setDescription(groupBudgetDTO.getDescription());
        groupBudget.setName(groupBudgetDTO.getName());
        groupBudget.setLimitAmount(groupBudgetDTO.getLimitAmount());
        return groupBudgetRepo.save(groupBudget);
    }

    @Override
    public List<GroupBudget> deleteBudget(GroupBudgetDTO groupBudgetDTO, UUID groupBudgetId) throws IllegalAccessException {
        if(!groupMemberService.IsAdminOfGroupWallet(groupBudgetDTO.getCreatedUserId(), groupBudgetDTO.getGroupWalletId())){
            log.info("Group Create User ID: " + groupBudgetDTO.getCreatedUserId());
            throw new IllegalAccessException("Only Admin can change a budget");
        }
        GroupBudget groupBudget = findById(groupBudgetId);
        groupBudget.setIsActive(false);
        groupBudgetRepo.save(groupBudget);

        return findAllByGroupWalletID(groupBudgetDTO.getGroupWalletId());
    }
}
