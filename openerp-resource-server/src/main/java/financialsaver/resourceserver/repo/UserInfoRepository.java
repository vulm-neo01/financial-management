package financialsaver.resourceserver.repo;

import financialsaver.resourceserver.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, String> {
    UserInfo findByUsername(String username);

    UserInfo findByEmail(String email);
}
