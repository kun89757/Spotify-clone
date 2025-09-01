package org.example.spotifyclone.service;

import org.example.spotifyclone.entity.Artist;
import com.baomidou.mybatisplus.extension.service.IService;
import org.example.spotifyclone.vo.RespBean;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-20
 */
public interface IArtistService extends IService<Artist> {

    RespBean getAllArtists();

    RespBean getArtistById(String id);
}
