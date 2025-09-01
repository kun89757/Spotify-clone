package org.example.spotifyclone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.spotifyclone.entity.PlaylistSong;
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
public interface PlaylistSongMapper extends BaseMapper<PlaylistSong> {

}
