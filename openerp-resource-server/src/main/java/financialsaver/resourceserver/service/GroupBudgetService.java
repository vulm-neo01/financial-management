package financialsaver.resourceserver.service;

import financialsaver.resourceserver.dto.GroupBudgetDTO;
import financialsaver.resourceserver.entity.group.GroupBudget;
import financialsaver.resourceserver.entity.group.GroupWallet;

import java.util.List;
import java.util.UUID;

public interface GroupBudgetService {
    List<GroupBudget> findAll();

    GroupBudget findById(UUID groupBudgetId);

    void createGroupBudgetDefault(GroupWallet groupWallet);

    List<GroupBudget> findAllByGroupWalletID(UUID groupWalletId);

    List<GroupBudget> createGroupBudget(GroupBudgetDTO groupBudgetDTO, GroupWallet groupWallet) throws IllegalAccessException;

    GroupBudget updateGroupBudget(GroupBudgetDTO groupBudgetDTO, GroupWallet groupWallet, UUID groupBudgetId) throws IllegalAccessException;

    List<GroupBudget> deleteBudget(GroupBudgetDTO groupBudgetDTO, UUID groupBudgetId) throws IllegalAccessException;
}
