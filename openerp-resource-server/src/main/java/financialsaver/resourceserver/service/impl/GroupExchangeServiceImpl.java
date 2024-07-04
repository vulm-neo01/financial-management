package financialsaver.resourceserver.service.impl;

import financialsaver.resourceserver.dto.request.BudgetGroupGraphRequest;
import financialsaver.resourceserver.dto.response.BudgetComparisonResult;
import financialsaver.resourceserver.dto.response.BudgetGraphResponse;
import financialsaver.resourceserver.dto.response.OverviewExchangeBudgetDTO;
import financialsaver.resourceserver.dto.response.OverviewGroupExchangeBudget;
import financialsaver.resourceserver.entity.Exchange;
import financialsaver.resourceserver.entity.group.GroupBudget;
import financialsaver.resourceserver.entity.support.BudgetCategory;
import financialsaver.resourceserver.entity.support.BudgetLimitHistory;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
        groupExchange.setImageUrl(groupExchange.getImageUrl());

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

    @Override
    public List<BudgetComparisonResult> getTotalAmountByBudget(UUID groupWalletId) {
        List<GroupExchange> listExchange = findAllByGroupWalletId(groupWalletId);
        List<GroupBudget> listBudget = groupBudgetService.findAllByGroupWalletID(groupWalletId);
        List<BudgetComparisonResult> comparisonResults = new ArrayList<>();


        for (GroupBudget budget : listBudget) {
            BigDecimal currentAmount = BigDecimal.ZERO;
            List<GroupExchange> exchanges = listExchange.stream().filter(groupExchange -> groupExchange.getBudget().getGroupBudgetId().equals(budget.getGroupBudgetId()))
                            .collect(Collectors.toList());

            for (GroupExchange exchange : exchanges) {
                currentAmount = currentAmount.add(exchange.getAmount());
            }

            comparisonResults.add(new BudgetComparisonResult(
                    budget.getGroupBudgetId(),
                    budget.getName(),
                    currentAmount,
                    budget.getLimitAmount(),
                    currentAmount.compareTo(budget.getLimitAmount()) > 0
            ));
        }
        return comparisonResults;
    }

    @Override
    public List<OverviewGroupExchangeBudget> getExchangeBudgetChanges(UUID groupWalletId) {
        List<GroupExchange> exchanges = findAllByGroupWalletId(groupWalletId);
        // Filter exchanges by exchangeTypeId spend and income
        List<GroupExchange> filteredExchanges = exchanges.stream()
                .filter(exchange -> "spend".equals(exchange.getExchangeType().getExchangeTypeId()) ||
                        "income".equals(exchange.getExchangeType().getExchangeTypeId()))
                .collect(Collectors.toList());

        // Group exchanges by BudgetCategory and map to DTO
        Map<GroupBudget, List<GroupExchange>> groupedByBudgetCategory = filteredExchanges.stream()
                .collect(Collectors.groupingBy(GroupExchange::getBudget));

        List<OverviewGroupExchangeBudget> result = new ArrayList<>();

        groupedByBudgetCategory.forEach((budgetCategory, exchangeList) -> {
            exchangeList.forEach(exchange -> {
                OverviewGroupExchangeBudget dto = new OverviewGroupExchangeBudget();
                dto.setAmount(exchange.getAmount());
                dto.setExchangeDate(exchange.getExchangeDate());
                dto.setGroupBudget(budgetCategory);
                dto.setExchangeType(exchange.getExchangeType().getExchangeTypeId());
                result.add(dto);
            });
        });

        return result;
    }

    @Override
    public List<BudgetGraphResponse> getBudgetExchangesDataGraph(BudgetGroupGraphRequest request) {
        ZonedDateTime zonedDateTime = request.getExchangeDate().atStartOfDay(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalDate date = zonedDateTime.toLocalDate();
        List<GroupBudget> groupBudgets = groupBudgetService.findAllByGroupWalletID(request.getGroupWalletId());
        List<BudgetGraphResponse> res = new ArrayList<>();

        List<GroupExchange> exchanges = findAllByGroupWalletId(request.getGroupWalletId()).stream()
                .filter(exchange -> {
                    LocalDate exchangeDate = exchange.getExchangeDate().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();
                    return exchangeDate.getMonthValue() == date.getMonth().getValue() &&
                            exchangeDate.getYear() == date.getYear();
                })
                .filter(exchange -> {
                    String exchangeTypeId = exchange.getExchangeType().getExchangeTypeId();
                    return "income".equals(exchangeTypeId) || "spend".equals(exchangeTypeId);
                })
                .collect(Collectors.toList());

        for(GroupBudget groupBudget : groupBudgets){
            BudgetGraphResponse budgetGraphResponse = new BudgetGraphResponse();
            budgetGraphResponse.setName(groupBudget.getName());
            budgetGraphResponse.setType(groupBudget.getType());
            budgetGraphResponse.setDate(date);
            BigDecimal total = BigDecimal.ZERO;
            for(GroupExchange exchange : exchanges){
                if(exchange.getBudget().getGroupBudgetId().equals(groupBudget.getGroupBudgetId())){
                    total = total.add(exchange.getAmount());
                }
            }
            budgetGraphResponse.setSpentAmount(total);

            budgetGraphResponse.setLimitAmount(groupBudget.getLimitAmount());
            if(groupBudget.getLimitAmount().compareTo(budgetGraphResponse.getSpentAmount()) > 0){
                budgetGraphResponse.setRemainAmount(groupBudget.getLimitAmount().subtract(budgetGraphResponse.getSpentAmount()));
            } else {
                budgetGraphResponse.setRemainAmount(BigDecimal.ZERO);
            }
            res.add(budgetGraphResponse);
        }
        return res;
    }
}
