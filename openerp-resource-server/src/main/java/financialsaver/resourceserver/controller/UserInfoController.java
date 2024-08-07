package financialsaver.resourceserver.controller;

import financialsaver.resourceserver.service.UserInfoService;
import lombok.AllArgsConstructor;
import financialsaver.resourceserver.entity.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/user-info")
public class UserInfoController {

    private UserInfoService userInfoService;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllUsers() {
        List<UserInfo> users = userInfoService.getAllUserInfos();
        return ResponseEntity.ok().body(users);
    }

    @GetMapping("/userId")
    public UserInfo getUsername(JwtAuthenticationToken token) {
        Jwt principal = (Jwt) token.getPrincipal();
        String username = principal.getClaim("preferred_username");
        return userInfoService.getUserInfo(username);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserInfo> getUserNameById(@PathVariable String userId){
        UserInfo userInfo = userInfoService.getUserById(userId);
        return ResponseEntity.ok().body(userInfo);
    }
}
