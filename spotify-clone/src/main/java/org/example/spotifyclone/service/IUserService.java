package org.example.spotifyclone.service;

import org.example.spotifyclone.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.userVo.LoginVo;
import org.example.spotifyclone.vo.userVo.RegisterVo;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-23
 */
public interface IUserService extends IService<User> {
    RespBean login(LoginVo user);

    RespBean register(RegisterVo user);
}
