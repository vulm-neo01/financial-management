package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, UUID> {
    List<Wallet> findAllByUser_UserId(String userId);

    List<Wallet> findAllByUser_UserIdAndIncludeInTotalAmount(String userId, boolean includeInTotalAmount);
}
