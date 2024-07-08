package financialsaver.resourceserver.controller;

import financialsaver.resourceserver.dto.WalletStatusDTO;
import lombok.AllArgsConstructor;
import financialsaver.resourceserver.dto.WalletDTO;
import financialsaver.resourceserver.entity.Wallet;
import financialsaver.resourceserver.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/wallet")
public class WalletController {

    private WalletService walletService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getWalletById(@PathVariable String id) {
        Wallet wallet = walletService.getWalletById(UUID.fromString(id));
        return ResponseEntity.ok().body(wallet);
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllWallets() {
        List<Wallet> wallets = walletService.getAllWallets();
        return ResponseEntity.ok().body(wallets);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getAllWalletsByUserId(@PathVariable String id) {
        List<Wallet> wallets = walletService.getListWalletByUserId(id);
        return ResponseEntity.ok().body(wallets);
    }

    @GetMapping("/include-in-total/{id}")
    public ResponseEntity<?> getAllWalletsByUserIdAndIncludeInTotal(@PathVariable String id) {
        List<Wallet> wallets = walletService.findWalletsByUserIdAndIncludeInTotalAmount(id, true);
        return ResponseEntity.ok().body(wallets);
    }

    @GetMapping("/not-include-in-total/{id}")
    public ResponseEntity<?> getAllWalletsByUserIdAndNotIncludeInTotal(@PathVariable String id) {
        List<Wallet> wallets = walletService.findWalletsByUserIdAndIncludeInTotalAmount(id, false);
        return ResponseEntity.ok().body(wallets);
    }

    @GetMapping("/total-amount/{userId}")
    public ResponseEntity<?> getTotalAmountByUserId(@PathVariable String userId){
        BigDecimal totalAmount = walletService.getCurrentTotalAmount(userId);
        return ResponseEntity.ok().body(totalAmount);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNewWallet(@RequestBody WalletDTO walletDTO){
        List<Wallet> wallets = walletService.createWallet(walletDTO);
        return ResponseEntity.ok().body(wallets);
    }

    @PostMapping("/change-status/{id}")
    public ResponseEntity<?> changeStatusWallet(@RequestBody WalletStatusDTO walletStatusDTO, @PathVariable String id){
        UUID walletId = UUID.fromString(id);
        List<Wallet> wallets = walletService.changeStatus(walletStatusDTO, walletId);
        return ResponseEntity.ok().body(wallets);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateWallet(@RequestBody WalletDTO walletDTO, @PathVariable String id){
        try {
            UUID walletId = UUID.fromString(id);
            List<Wallet> savedWallets = walletService.updateWallet(walletDTO, walletId);
            return ResponseEntity.ok(savedWallets);
        } catch (IllegalArgumentException e) {
            // Xử lý ngoại lệ khi id không hợp lệ
            return ResponseEntity.badRequest().body("Invalid Wallet ID");
        } catch (Exception e) {
            // Xử lý các ngoại lệ khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWallet(@RequestBody WalletStatusDTO statusDTO, @PathVariable String id){
        try {
            UUID walletId = UUID.fromString(id);
            List<Wallet> savedWallets = walletService.deleteWallet(statusDTO, walletId);
            return ResponseEntity.ok(savedWallets);
        } catch (IllegalArgumentException e) {
            // Xử lý ngoại lệ khi id không hợp lệ

            return ResponseEntity.badRequest().body("Invalid User ID or Wallet Id!");
        } catch (Exception e) {
            // Xử lý các ngoại lệ khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }
}