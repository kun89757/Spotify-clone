package org.example.spotifyclone.service;

import org.example.spotifyclone.entity.PlaylistSong;
import com.baomidou.mybatisplus.extension.service.IService;
import org.example.spotifyclone.vo.RespBean;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-23
 */
public interface IPlaylistSongService extends IService<PlaylistSong> {
    RespBean getPlaylistSongs(int playlistId);
}
