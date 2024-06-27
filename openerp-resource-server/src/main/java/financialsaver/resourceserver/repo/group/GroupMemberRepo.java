package financialsaver.resourceserver.repo.group;

import financialsaver.resourceserver.entity.group.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupMemberRepo extends JpaRepository<GroupMember, UUID> {
    List<GroupMember> findAllByWallet_GroupWalletId(UUID groupWalletId);

    List<GroupMember> findAllByUser_UserId(String userId);
}
