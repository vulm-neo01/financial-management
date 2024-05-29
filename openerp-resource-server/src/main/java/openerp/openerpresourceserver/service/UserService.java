package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.User;
import openerp.openerpresourceserver.entity.UserInfo;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    User getUserById(String id);

    void synchronizeUser(String userId, String email, String firstName, String lastName);

//    String getUserInfoId(String username);
}
