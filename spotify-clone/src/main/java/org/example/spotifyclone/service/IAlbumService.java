package org.example.spotifyclone.service;

import org.example.spotifyclone.entity.Album;
import com.baomidou.mybatisplus.extension.service.IService;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.albumVo.AddAlbumVo;
import org.example.spotifyclone.vo.albumVo.UpdateVo;
import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-20
 */
public interface IAlbumService extends IService<Album> {
    RespBean getAllAlbums();

    RespBean getAlbumById(String id);

    RespBean addAlbum(AddAlbumVo vo) throws Exception;

    RespBean uploadCover(MultipartFile file) throws Exception;

    RespBean deleteById(String id);

    RespBean updateAlbum(UpdateVo vo) throws Exception;
}
