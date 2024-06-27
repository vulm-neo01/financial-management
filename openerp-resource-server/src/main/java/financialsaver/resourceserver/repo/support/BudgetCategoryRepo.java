package financialsaver.resourceserver.repo.support;

import financialsaver.resourceserver.entity.support.BudgetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BudgetCategoryRepo extends JpaRepository<BudgetCategory, UUID> {
    List<BudgetCategory> findAllByType(String type);

    List<BudgetCategory> findAllByUser_UserId(String userId);

    @Query("SELECT b FROM BudgetCategory b WHERE b.user IS NULL")
    List<BudgetCategory> findByUserIsNull();
}
