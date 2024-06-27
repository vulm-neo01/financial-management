package financialsaver.resourceserver.service.impl;

import financialsaver.resourceserver.entity.support.ExchangeType;
import financialsaver.resourceserver.repo.support.ExchangeTypeRepo;
import financialsaver.resourceserver.service.UserInfoService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import financialsaver.resourceserver.dto.GroupExchangeDTO;
import financialsaver.resourceserver.entity.group.GroupExchange;
import financialsaver.resourceserver.entity.group.GroupWallet;
import financialsaver.resourceserver.repo.group.GroupExchangeRepo;
import financialsaver.resourceserver.service.GroupBudgetService;
import financialsaver.resourceserver.service.GroupExchangeService;
import financialsaver.resourceserver.service.GroupWalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
public class GroupExchangeServiceImpl implements GroupExchangeService {
    private GroupExchangeRepo groupExchangeRepo;
    private UserInfoService userInfoService;
    private GroupBudgetService groupBudgetService;
    private ExchangeTypeRepo exchangeTypeRepo;
    private GroupWalletService groupWalletService;
    @Override
    public List<GroupExchange> findAll() {
        return groupExchangeRepo.findAll();
    }

    @Override
    public GroupExchange findById(UUID groupExchangeId) {
        return groupExchangeRepo.findById(groupExchangeId)
                .orElseThrow(() -> new IllegalArgumentException("Exchange is not exist!"));
    }

    @Override
    public List<GroupExchange> findAllByGroupWalletId(UUID groupWalletId) {
        return groupExchangeRepo.findAllByGroupWallet_GroupWalletId(groupWalletId);
    }

    @Override
    public List<GroupExchange> createNewExchange(GroupExchangeDTO groupExchangeDTO, GroupWallet groupWallet) {
        ExchangeType exchangeType = exchangeTypeRepo.findById(groupExchangeDTO.getExchangeTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Can not find Exchange Type equivalent!"));

        GroupExchange groupExchange = GroupExchange.builder()
                .exchangeDate(groupExchangeDTO.getExchangeDate())
                .exchangeType(exchangeType)
                .from(groupExchangeDTO.getFrom())
                .to(groupExchangeDTO.getTo())
                .name(groupExchangeDTO.getName())
                .createdAt(new Date())
                .updatedAt(new Date())
                .createdUser(userInfoService.getUserById(groupExchangeDTO.getCreatedUserId()))
                .updatedUserId(null)
                .amount(groupExchangeDTO.getAmount())
                .budget(groupBudgetService.findById(groupExchangeDTO.getGroupBudgetId()))
                .imageUrl(groupExchangeDTO.getImageUrl())
                .description(groupExchangeDTO.getDescription())
                .groupWallet(groupWallet)
                .build();
        groupExchangeRepo.save(groupExchange);
        if(groupExchangeDTO.getExchangeTypeId().equals("income")){
            groupWalletService.UpdateAfterUpdatedExchange(groupExchangeDTO.getAmount(), groupWallet.getGroupWalletId());
        } else if(groupExchangeDTO.getExchangeTypeId().equals("spend")){
            groupWalletService.UpdateAfterUpdatedExchange(groupExchangeDTO.getAmount().negate(), groupWallet.getGroupWalletId());
        }

        return findAllByGroupWalletId(groupExchangeDTO.getGroupWalletId());
    }

    @Override
    public List<GroupExchange> updateExchange(GroupExchangeDTO groupExchangeDTO, GroupWallet groupWallet, UUID groupExchangeId) {
        GroupExchange groupExchange = findById(groupExchangeId);

        BigDecimal oldAmount = groupExchange.getAmount();
        BigDecimal newAmount = groupExchangeDTO.getAmount();

        groupExchange.setName(groupExchangeDTO.getName());
        groupExchange.setFrom(groupExchangeDTO.getFrom());
        groupExchange.setTo(groupExchangeDTO.getTo());
        groupExchange.setAmount(groupExchangeDTO.getAmount());
        groupExchange.setExchangeDate(groupExchangeDTO.getExchangeDate());
        groupExchange.setBudget(groupBudgetService.findById(groupExchangeDTO.getGroupBudgetId()));
        groupExchange.setDescription(groupExchangeDTO.getDescription());
        groupExchange.setUpdatedUserId(groupExchangeDTO.getCreatedUserId());
        groupExchange.setUpdatedAt(new Date());

        groupExchangeRepo.save(groupExchange);

        if(groupExchange.getExchangeType().getExchangeTypeId().equals("income")){
            groupWalletService.UpdateAfterUpdatedExchange(oldAmount.negate(), groupWallet.getGroupWalletId());
            groupWalletService.UpdateAfterUpdatedExchange(newAmount, groupWallet.getGroupWalletId());
        } else if(groupExchange.getExchangeType().getExchangeTypeId().equals("spend")){
            groupWalletService.UpdateAfterUpdatedExchange(oldAmount, groupWallet.getGroupWalletId());
            groupWalletService.UpdateAfterUpdatedExchange(newAmount.negate(), groupWallet.getGroupWalletId());
        }

        return findAllByGroupWalletId(groupWallet.getGroupWalletId());
    }

    @Override
    public List<GroupExchange> deleteExchange(UUID groupExchangeId) {
        GroupExchange groupExchange = findById(groupExchangeId);
        UUID groupWalletId = groupExchange.getGroupWallet().getGroupWalletId();
        BigDecimal oldAmount = groupExchange.getAmount();
        String exchangeTypeId = groupExchange.getExchangeType().getExchangeTypeId();

        groupExchangeRepo.delete(groupExchange);
        if(exchangeTypeId.equals("income")){
            groupWalletService.UpdateAfterUpdatedExchange(oldAmount.negate(), groupWalletId);
        } else if(exchangeTypeId.equals("spend")){
            groupWalletService.UpdateAfterUpdatedExchange(oldAmount, groupWalletId);
        }

        return groupExchangeRepo.findAllByGroupWallet_GroupWalletId(groupWalletId);
    }
}
