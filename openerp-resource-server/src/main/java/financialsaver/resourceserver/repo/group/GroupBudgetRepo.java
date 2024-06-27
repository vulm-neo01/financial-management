package financialsaver.resourceserver.repo.group;

import financialsaver.resourceserver.entity.group.GroupBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupBudgetRepo extends JpaRepository<GroupBudget, UUID> {

    List<GroupBudget> findAllByGroupWallet_GroupWalletId(UUID groupWalletId);
}
