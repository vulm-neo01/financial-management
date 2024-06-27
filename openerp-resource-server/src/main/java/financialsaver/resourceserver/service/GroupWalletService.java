package financialsaver.resourceserver.service;

import financialsaver.resourceserver.dto.GroupWalletDTO;
import financialsaver.resourceserver.entity.group.GroupWallet;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface GroupWalletService {
    List<GroupWallet> getAllByUserId(String userId);

    GroupWallet getById(UUID groupWalletId);

    List<GroupWallet> createNewGroupWallet(GroupWalletDTO groupWalletDTO);

    GroupWallet updateGroupWallet(GroupWalletDTO groupWalletDTO, UUID groupWalletId) throws IllegalAccessException;

    void UpdateAfterUpdatedExchange(BigDecimal amount, UUID groupWalletId);

    List<GroupWallet> deleteGroupWallet(GroupWalletDTO groupWalletDTO, UUID groupWalletId) throws IllegalAccessException;
}
