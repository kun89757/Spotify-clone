package org.example.spotifyclone.service;

import org.example.spotifyclone.entity.Song;
import com.baomidou.mybatisplus.extension.service.IService;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.songVo.AddVo;
import org.example.spotifyclone.vo.songVo.UpdateVo;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-20
 */
public interface ISongService extends IService<Song> {
    RespBean getList();

    RespBean addSong(AddVo vo) throws Exception;

    RespBean uploadImage(MultipartFile file) throws Exception;

    RespBean uploadAudio(MultipartFile file) throws Exception;

    RespBean deleteById(String id);

    RespBean getSongsByAlbum(String albumId);

    RespBean batchImport(MultipartFile file);

    RespBean test();

    RespBean updateSong(UpdateVo updateVo) throws Exception;

    RespBean getSongById(String id);
}
