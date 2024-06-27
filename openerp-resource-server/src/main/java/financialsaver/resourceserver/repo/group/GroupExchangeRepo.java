package financialsaver.resourceserver.repo.group;

import financialsaver.resourceserver.entity.group.GroupExchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupExchangeRepo extends JpaRepository<GroupExchange, UUID> {
    List<GroupExchange> findAllByGroupWallet_GroupWalletId(UUID groupWalletId);
}
