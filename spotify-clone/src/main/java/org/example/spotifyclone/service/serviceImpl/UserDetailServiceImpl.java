//package org.example.spotifyclone.service.serviceImpl;
//
//import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
//import org.example.spotifyclone.entity.User;
//import org.example.spotifyclone.mapper.UserMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class UserDetailServiceImpl implements UserDetailsService {
//
//    @Autowired
//    private UserMapper userMapper;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
//        queryWrapper.eq("username", username);
//        User user = userMapper.selectOne(queryWrapper);
//        List<GrantedAuthority> authorities = new ArrayList<>();
//        return new org.springframework.security.core.userdetails.User(user.getName(), user.getPassword(), authorities);
//    }
//}
