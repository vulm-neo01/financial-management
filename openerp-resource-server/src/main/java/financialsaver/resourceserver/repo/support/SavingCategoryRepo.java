package financialsaver.resourceserver.repo.support;

import financialsaver.resourceserver.entity.support.SavingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SavingCategoryRepo extends JpaRepository<SavingCategory, UUID> {
}
