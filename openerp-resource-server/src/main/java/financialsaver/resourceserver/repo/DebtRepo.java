package financialsaver.resourceserver.repo;

import financialsaver.resourceserver.entity.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DebtRepo extends JpaRepository<Debt, UUID> {
    List<Debt> findAllByUser_UserId(String userId);
}
