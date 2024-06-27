package financialsaver.resourceserver.repo.support;

import financialsaver.resourceserver.entity.support.ExchangeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeTypeRepo extends JpaRepository<ExchangeType, String> {
}
