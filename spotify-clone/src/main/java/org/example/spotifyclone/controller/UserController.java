package org.example.spotifyclone.controller;

import org.example.spotifyclone.entity.User;
import org.example.spotifyclone.service.IUserService;
import org.example.spotifyclone.utils.JWTUtils;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.RespBeanEnum;
import org.example.spotifyclone.vo.userVo.LoginVo;
import org.example.spotifyclone.vo.userVo.RegisterVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-23
 */
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private IUserService userService;

    @PostMapping("/login")
    public RespBean login(@RequestBody LoginVo user) {
        try {
            User exisitingUser = (User) userService.login(user).getData();
            Map<String, String> payload = new HashMap<>();
            payload.put("id", String.valueOf(exisitingUser.getId()));
            payload.put("username", exisitingUser.getUsername());
            String token = JWTUtils.getToken(payload);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", String.valueOf(exisitingUser.getId()));
            return RespBean.success(response);
        } catch (Exception e) {
            return RespBean.error(RespBeanEnum.LOGIN_FAILED);
        }
    }

    @PostMapping("/register")
    public RespBean register(@RequestBody RegisterVo registerVo) {
        return userService.register(registerVo);
    }
}
