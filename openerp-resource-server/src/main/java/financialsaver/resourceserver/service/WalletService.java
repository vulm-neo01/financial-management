package financialsaver.resourceserver.service;

import financialsaver.resourceserver.dto.WalletStatusDTO;
import financialsaver.resourceserver.dto.WalletDTO;
import financialsaver.resourceserver.entity.Wallet;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface WalletService {
    Wallet getWalletById(UUID id);

    List<Wallet> getAllWallets();

    List<Wallet> getListWalletByUserId(String id);

    List<Wallet> findWalletsByUserIdAndIncludeInTotalAmount(String userId, Boolean includedInTotal);

    List<Wallet> createWallet(WalletDTO walletDTO);

    List<Wallet> updateWallet(WalletDTO walletDTO, UUID walletID);

    List<Wallet> updateWalletFromExchange(Wallet wallet);

    List<Wallet> changeStatus(WalletStatusDTO status, UUID walletId);

    List<Wallet> deleteWallet(WalletStatusDTO statusDTO, UUID walletId);

    Wallet updateWalletAfterUpdateExchange(UUID walletId, BigDecimal amount);

    BigDecimal getCurrentTotalAmount(String userId);
}
