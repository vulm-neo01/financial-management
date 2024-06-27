package financialsaver.resourceserver.repo.support;

import financialsaver.resourceserver.entity.support.Logo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogoRepo extends JpaRepository<Logo, String> {
    List<Logo> findAllByType(String type);
}
