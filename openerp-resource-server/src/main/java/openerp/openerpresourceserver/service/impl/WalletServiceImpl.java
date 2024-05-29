package openerp.openerpresourceserver.service.impl;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.WalletDTO;
import openerp.openerpresourceserver.dto.WalletStatusDTO;
import openerp.openerpresourceserver.entity.UserInfo;
import openerp.openerpresourceserver.entity.Wallet;
import openerp.openerpresourceserver.entity.support.Color;
import openerp.openerpresourceserver.entity.support.Logo;
import openerp.openerpresourceserver.repo.UserInfoRepository;
import openerp.openerpresourceserver.repo.WalletRepository;
import openerp.openerpresourceserver.repo.support.ColorRepo;
import openerp.openerpresourceserver.repo.support.LogoRepo;
import openerp.openerpresourceserver.service.UserInfoService;
import openerp.openerpresourceserver.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.core.AbstractMessageSendingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class WalletServiceImpl implements WalletService {

    private WalletRepository walletRepository;
    private UserInfoService userInfoService;
    private LogoRepo logoRepo;
    private ColorRepo colorRepo;
//    private CurrencyCategoryRepo currencyCategoryRepo;

    @Override
    public Wallet getWalletById(UUID id) {
        return walletRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Not exist wallet with id " + id));
    }

    @Override
    public List<Wallet> getAllWallets() {
        return walletRepository.findAll(Sort.by(Sort.Direction.ASC, "walletId"));
    }

    @Override
    public List<Wallet> getListWalletByUserId(String id) {
        return walletRepository.findAllByUser_UserId(id);
    }

    @Override
    public List<Wallet> findWalletsByUserIdAndIncludeInTotalAmount(String userId, Boolean includedInTotal) {
        return walletRepository.findAllByUser_UserIdAndIncludeInTotalAmount(userId, includedInTotal);
    }

    @Override
    public List<Wallet> createWallet(WalletDTO walletDTO) {
        Wallet wallet = new Wallet();
        wallet.setWalletId(UUID.randomUUID());

        UserInfo user = userInfoService.getUserById(walletDTO.getUserId());
        wallet.setUser(user);

        Logo logo = logoRepo.findById(walletDTO.getLogoId())
                .orElseThrow(() -> new NoSuchElementException("Logo not found with ID: " + walletDTO.getLogoId()));
        wallet.setLogo(logo);

        Color color = colorRepo.findById(walletDTO.getColorId())
                .orElseThrow(() -> new NoSuchElementException("Color not found with ID: " + walletDTO.getColorId()));
        wallet.setColor(color);

        wallet.setType(walletDTO.getType());
        wallet.setAmount(new BigDecimal(walletDTO.getAmount()));
        wallet.setName(walletDTO.getName());
        wallet.setDescription(walletDTO.getDescription());
        wallet.setIncludeInTotalAmount(walletDTO.getIncludeInTotalAmount());
        wallet.setCreatedAt(new Date());
        wallet.setUpdatedAt(new Date());
        walletRepository.save(wallet);

        return getListWalletByUserId(wallet.getUser().getUserId());
    }

    @Override
    public List<Wallet> updateWallet(WalletDTO updatedWallet, UUID walletID) {
        log.info("Wallet ID: " + walletID);
        Wallet existingWallet = getWalletById(walletID);

        if (updatedWallet.getName() != null) {
            existingWallet.setName(updatedWallet.getName());
        }
        if (updatedWallet.getAmount() != null) {
            existingWallet.setAmount(new BigDecimal(updatedWallet.getAmount()));
        }
        if (updatedWallet.getType() != null) {
            existingWallet.setType(updatedWallet.getType());
        }
        if (updatedWallet.getDescription() != null) {
            existingWallet.setDescription(updatedWallet.getDescription());
        }
        if (updatedWallet.getIncludeInTotalAmount() != null) {
            existingWallet.setIncludeInTotalAmount(updatedWallet.getIncludeInTotalAmount());
        }

        Logo logo = logoRepo.findById(updatedWallet.getLogoId())
                .orElseThrow(() -> new NoSuchElementException("Logo not found with ID: " + updatedWallet.getLogoId()));
        existingWallet.setLogo(logo);

        Color color = colorRepo.findById(updatedWallet.getColorId())
                .orElseThrow(() -> new NoSuchElementException("Color not found with ID: " + updatedWallet.getColorId()));
        existingWallet.setColor(color);

        existingWallet.setUpdatedAt(new Date());

        Wallet savedWallet = walletRepository.save(existingWallet);
        return getListWalletByUserId(savedWallet.getUser().getUserId());
    }

    @Override
    public List<Wallet> updateWalletFromExchange(Wallet wallet) {
//        Wallet updatedWallet = getWalletById(wallet.getWalletId());
//        updatedWallet.setUpdatedAt(new Date());
        log.info(wallet.getWalletId());
        walletRepository.save(wallet);
        return getListWalletByUserId(wallet.getUser().getUserId());
    }

    @Override
    public List<Wallet> changeStatus(WalletStatusDTO updateWallet, UUID id) {
        Wallet wallet = getWalletById(id);
        String userIdFromRequest = updateWallet.getUserId();

        if (wallet != null && userIdFromRequest != null && userIdFromRequest.equals(wallet.getUser().getUserId())) {
            wallet.setIncludeInTotalAmount(updateWallet.getStatus());
            wallet.setUpdatedAt(new Date());
            walletRepository.save(wallet);
            return getListWalletByUserId(wallet.getUser().getUserId());
        } else {
            // Throw an exception or return null to indicate that the user ID from the request is invalid
            log.error("Wrong User Id");
            throw new IllegalArgumentException("Invalid user ID or wallet not found");
        }
    }

    @Override
    public List<Wallet> deleteWallet(WalletStatusDTO statusDTO, UUID walletId) {
        Wallet wallet = getWalletById(walletId);
        String userIdFromRequest = statusDTO.getUserId();

        if (wallet != null && userIdFromRequest != null && userIdFromRequest.equals(wallet.getUser().getUserId())) {
            walletRepository.delete(wallet);
            return getListWalletByUserId(wallet.getUser().getUserId());
        } else {
            // Throw an exception or return null to indicate that the user ID from the request is invalid
            log.error("Wrong User Id");
            throw new IllegalArgumentException("Invalid user ID or wallet not found");
        }
    }

    @Override
    public Wallet updateWalletAfterUpdateExchange(UUID walletId, BigDecimal amount) {
        Wallet wallet = getWalletById(walletId);
        wallet.setAmount(wallet.getAmount().add(amount));
        wallet.setUpdatedAt(new Date());
        walletRepository.save(wallet);
        // còn vấn đề reset lại thời gian update ví thì mình nghĩ là thôi
        return wallet;
    }
}
