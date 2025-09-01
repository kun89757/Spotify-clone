package org.example.spotifyclone.service;

import org.example.spotifyclone.entity.Playlist;
import com.baomidou.mybatisplus.extension.service.IService;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.playlistVo.AddToPlaylistVo;
import org.example.spotifyclone.vo.playlistVo.GetPlaylistVo;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-23
 */
public interface IPlaylistService extends IService<Playlist> {

    RespBean getPlayList(GetPlaylistVo vo);

    RespBean addToPlaylist(AddToPlaylistVo vo);

    RespBean cancelPlaylist(AddToPlaylistVo vo);
}
