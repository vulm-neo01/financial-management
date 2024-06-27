package financialsaver.resourceserver.repo;

import financialsaver.resourceserver.entity.Saving;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SavingRepo extends JpaRepository<Saving, UUID> {
    List<Saving> findAllByUser_UserId(String userId);

    List<Saving> findAllBySavingCategory_SavingCategoryId(UUID savingCategoryId);
}
