package financialsaver.resourceserver.repo.support;

import financialsaver.resourceserver.entity.support.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColorRepo extends JpaRepository<Color, String> {
    List<Color> findAllByType(String type);
}
