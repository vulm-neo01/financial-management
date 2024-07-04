package financialsaver.resourceserver.service;

import financialsaver.resourceserver.dto.GroupExchangeDTO;
import financialsaver.resourceserver.dto.request.BudgetGroupGraphRequest;
import financialsaver.resourceserver.dto.response.BudgetComparisonResult;
import financialsaver.resourceserver.dto.response.BudgetGraphResponse;
import financialsaver.resourceserver.dto.response.OverviewGroupExchangeBudget;
import financialsaver.resourceserver.entity.group.GroupExchange;
import financialsaver.resourceserver.entity.group.GroupWallet;

import java.util.List;
import java.util.UUID;

public interface GroupExchangeService {
    List<GroupExchange> findAll();

    GroupExchange findById(UUID groupExchangeId);

    List<GroupExchange> findAllByGroupWalletId(UUID groupWalletId);

    List<GroupExchange> createNewExchange(GroupExchangeDTO groupExchangeDTO, GroupWallet groupWallet);

    List<GroupExchange> updateExchange(GroupExchangeDTO groupExchangeDTO, GroupWallet groupWallet, UUID groupExchangeId);

    List<GroupExchange> deleteExchange(UUID groupExchangeId);

    List<BudgetComparisonResult> getTotalAmountByBudget(UUID groupWalletId);

    List<OverviewGroupExchangeBudget> getExchangeBudgetChanges(UUID groupWalletId);

    List<BudgetGraphResponse> getBudgetExchangesDataGraph(BudgetGroupGraphRequest request);
}
