package org.example.spotifyclone.mapper;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.ibatis.annotations.Mapper;
import org.example.spotifyclone.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-23
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
}
