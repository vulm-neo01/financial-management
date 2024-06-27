package financialsaver.resourceserver.service.impl;

import financialsaver.resourceserver.entity.UserInfo;
import financialsaver.resourceserver.repo.UserInfoRepository;
import financialsaver.resourceserver.service.BudgetService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import financialsaver.resourceserver.entity.User;
import financialsaver.resourceserver.repo.UserRepo;
import financialsaver.resourceserver.repo.support.CurrencyCategoryRepo;
import financialsaver.resourceserver.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class UserServiceImpl implements UserService {

    private UserRepo userRepo;
    private UserInfoRepository userInfoRepository;
    private CurrencyCategoryRepo currencyCategoryRepo;
    private BudgetService budgetService;

    @Override
    public List<User> getAllUsers() {
        List<User> users = userRepo.findAll(Sort.by(Sort.Direction.ASC, "id"));
        return users;
    }

    @Override
    public User getUserById(String id) {
        Optional<User> user = userRepo.findById(id);

        if (user.isEmpty()) {
            throw new NoSuchElementException("Not exist user with id " + id);
        }
        return user.get();
    }

    @Override
    public void synchronizeUser(String userId, String email, String firstName, String lastName) {
        User user = userRepo.findById(userId).orElse(null);

        if (user == null) {
            user = User.builder()
                    .id(userId)
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .enabled(true)
                    .build();
            userRepo.save(user);

            User saveUser = getUserById(userId);

            UserInfo userInfo = UserInfo.builder()
                    .userId(UUID.randomUUID().toString())
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email)
                    .username(userId)
                    .currency(currencyCategoryRepo.findById("currency_00").orElseThrow(IllegalArgumentException::new))
                    .build();
            UserInfo saveUserInfo = userInfoRepository.save(userInfo);

            budgetService.getPredefinedList(saveUserInfo);
        } else if (StringUtils.compareIgnoreCase(email, user.getEmail()) != 0 ||
                StringUtils.compareIgnoreCase(firstName, user.getFirstName()) != 0 ||
                StringUtils.compareIgnoreCase(lastName, user.getLastName()) != 0) {

            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);

            userRepo.save(user);

            UserInfo userInfo = userInfoRepository.findByUsername(user.getId());
            if (userInfo != null) {
                boolean isUserInfoUpdated = false;

                if (!StringUtils.equalsIgnoreCase(email, userInfo.getEmail())) {
                    userInfo.setEmail(email);
                    isUserInfoUpdated = true;
                }
                if (!StringUtils.equalsIgnoreCase(firstName, userInfo.getFirstName())) {
                    userInfo.setFirstName(firstName);
                    isUserInfoUpdated = true;
                }
                if (!StringUtils.equalsIgnoreCase(lastName, userInfo.getLastName())) {
                    userInfo.setLastName(lastName);
                    isUserInfoUpdated = true;
                }
                if (isUserInfoUpdated) {
                    userInfoRepository.save(userInfo);
                }
            }
        }
    }

//    @Override
//    public String getUserInfoId(String username) {
//        return userInfoRepository.findByUsername(username).getUserId();
//    }

}
