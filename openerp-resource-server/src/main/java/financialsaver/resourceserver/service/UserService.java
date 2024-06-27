package financialsaver.resourceserver.service;

import financialsaver.resourceserver.entity.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    User getUserById(String id);

    void synchronizeUser(String userId, String email, String firstName, String lastName);

//    String getUserInfoId(String username);
}
