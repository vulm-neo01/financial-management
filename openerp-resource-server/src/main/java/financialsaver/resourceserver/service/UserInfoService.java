package financialsaver.resourceserver.service;

import financialsaver.resourceserver.entity.UserInfo;

import java.util.List;

public interface UserInfoService {
    List<UserInfo> getAllUserInfos();

    UserInfo getUserById(String id);

    UserInfo createNewUserInfo(UserInfo userInfo);

    UserInfo getUserInfo(String username);

    UserInfo getUserByUsernameOrEmail(String identifier);
}
