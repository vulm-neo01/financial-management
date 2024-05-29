package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.UserInfo;

import java.util.List;

public interface UserInfoService {
    List<UserInfo> getAllUserInfos();

    UserInfo getUserById(String id);

    UserInfo createNewUserInfo(UserInfo userInfo);

    UserInfo getUserInfo(String username);
}
