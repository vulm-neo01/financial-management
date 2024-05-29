package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.User;
import openerp.openerpresourceserver.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, String> {
    UserInfo findByUsername(String username);
}
