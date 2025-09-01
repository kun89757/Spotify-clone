package org.example.spotifyclone.service.serviceImpl;

import org.example.spotifyclone.entity.PlaylistSong;
import org.example.spotifyclone.mapper.PlaylistSongMapper;
import org.example.spotifyclone.service.IPlaylistSongService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.spotifyclone.vo.RespBean;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-23
 */
@Service
public class PlaylistSongServiceImpl extends ServiceImpl<PlaylistSongMapper, PlaylistSong> implements IPlaylistSongService {

    @Override
    public RespBean getPlaylistSongs(int playlistId) {
        return null;
    }
}
