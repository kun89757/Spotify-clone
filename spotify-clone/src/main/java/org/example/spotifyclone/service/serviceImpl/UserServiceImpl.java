package org.example.spotifyclone.service.serviceImpl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.example.spotifyclone.entity.Playlist;
import org.example.spotifyclone.entity.User;
import org.example.spotifyclone.mapper.PlaylistMapper;
import org.example.spotifyclone.mapper.UserMapper;
import org.example.spotifyclone.service.IUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.RespBeanEnum;
import org.example.spotifyclone.vo.userVo.LoginVo;
import org.example.spotifyclone.vo.userVo.RegisterVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-23
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final String EMAIL_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

    public boolean validateEmail(String email) {
        // 编译正则表达式
        Pattern pattern = Pattern.compile(EMAIL_PATTERN);
        // 使用正则表达式匹配邮箱
        return pattern.matcher(email).matches();
    }

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PlaylistMapper playlistMapper;

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public RespBean login(LoginVo user) {
        System.out.println(user);
        User exsitingUser = userMapper.selectOne(new QueryWrapper<User>()
                .eq("username", user.getUsername()));
        return RespBean.success(exsitingUser);
//        if (exsitingUser != null) {
//            if (passwordEncoder.matches(user.getPassword(), exsitingUser.getPassword())) {
//                return RespBean.success(exsitingUser);
//            }
//        }
//        return RespBean.error(RespBeanEnum.LOGIN_FAILED);
    }

    @Override
    public RespBean register(RegisterVo user) {
        if (userMapper.selectOne(new QueryWrapper<User>().eq("username", user.getUsername())) != null) {
            return RespBean.error(RespBeanEnum.USERNAME_ALREADY_EXIST);
        }
        if (userMapper.selectOne(new QueryWrapper<User>().eq("email", user.getEmail())) != null) {
            return RespBean.error(RespBeanEnum.USER_ALREADY_EXIST);
        }
        String encodePassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodePassword);
        User toRegister = new User();
        if (!validateEmail(user.getEmail())) {
            return RespBean.error(RespBeanEnum.INCORRECT_EMAIL);
        }
        toRegister.setUsername(user.getUsername());
//        toRegister.setPassword(encodePassword);
        toRegister.setPassword(user.getPassword());
        toRegister.setEmail(user.getEmail());
        userMapper.insert(toRegister);
        Playlist playlist = new Playlist();
        playlist.setUserId(toRegister.getId());
        playlist.setName(toRegister.getUsername() + "的最爱");
        playlist.setCover("https://res.cloudinary.com/dujbenr43/image/upload/v1721733082/file_yvh4xb.jpg");
        playlist.setBackgroundColor("#87CEFA");
        playlistMapper.insert(playlist);
        return RespBean.success();
    }
}
