package financialsaver.resourceserver.repo;

import financialsaver.resourceserver.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LoanRepo extends JpaRepository<Loan, UUID> {
    List<Loan> findAllByUser_UserId(String userId);
}
