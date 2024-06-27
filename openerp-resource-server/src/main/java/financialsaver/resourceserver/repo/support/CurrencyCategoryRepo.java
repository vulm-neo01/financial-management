package financialsaver.resourceserver.repo.support;

import financialsaver.resourceserver.entity.support.CurrencyCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyCategoryRepo extends JpaRepository<CurrencyCategory, String> {
}
