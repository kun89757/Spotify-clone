package org.example.spotifyclone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.spotifyclone.entity.Artist;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-20
 */
@Mapper
public interface ArtistMapper extends BaseMapper<Artist> {

}
