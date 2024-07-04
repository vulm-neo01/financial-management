package financialsaver.resourceserver.service.impl;

import financialsaver.resourceserver.entity.UserInfo;
import financialsaver.resourceserver.repo.UserInfoRepository;
import financialsaver.resourceserver.service.UserInfoService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class UserInfoServiceImpl implements UserInfoService {

    private UserInfoRepository userInfoRepository;
    @Override
    public List<UserInfo> getAllUserInfos() {
        return userInfoRepository.findAll();
    }

    @Override
    public UserInfo getUserById(String id) {
        Optional<UserInfo> user = userInfoRepository.findById(id);

        if(user.isEmpty()){
            throw new IllegalArgumentException("User Id is not wrong or User is not existence!");
        }

        return user.get();
    }

    @Override
    public UserInfo createNewUserInfo(UserInfo userInfo) {
        return userInfoRepository.save(userInfo);
    }

    @Override
    public UserInfo getUserInfo(String username) {
        return userInfoRepository.findByUsername(username);
    }

    @Override
    public UserInfo getUserByUsernameOrEmail(String identifier) {
        UserInfo user = userInfoRepository.findByUsername(identifier);
        if (user == null) {
            user = userInfoRepository.findByEmail(identifier);
        }
        return user;
    }
}
