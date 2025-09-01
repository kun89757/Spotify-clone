package org.example.spotifyclone.service.serviceImpl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.example.spotifyclone.entity.Playlist;
import org.example.spotifyclone.entity.PlaylistSong;
import org.example.spotifyclone.entity.Song;
import org.example.spotifyclone.mapper.PlaylistMapper;
import org.example.spotifyclone.mapper.PlaylistSongMapper;
import org.example.spotifyclone.mapper.SongMapper;
import org.example.spotifyclone.service.IPlaylistService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.RespBeanEnum;
import org.example.spotifyclone.vo.playlistVo.AddToPlaylistVo;
import org.example.spotifyclone.vo.playlistVo.GetPlaylistVo;
import org.example.spotifyclone.vo.playlistVo.PlaylistVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-23
 */
@Service
public class PlaylistServiceImpl extends ServiceImpl<PlaylistMapper, Playlist> implements IPlaylistService {

    @Autowired
    private PlaylistMapper playlistMapper;
    @Autowired
    private PlaylistSongMapper playlistSongMapper;
    @Autowired
    private SongMapper songMapper;

    @Override
    public RespBean getPlayList(GetPlaylistVo vo) {
        QueryWrapper<Playlist> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", vo.getUserId());
        Playlist playlist = playlistMapper.selectOne(queryWrapper);
        if (playlist != null) {
            Long playlistId = playlist.getId();
            List<Song> songs = new ArrayList<>();
            var playlistSongs = playlistSongMapper.selectList(new QueryWrapper<PlaylistSong>().eq("playlist_id", playlistId));
            if (!playlistSongs.isEmpty()) {
                for (PlaylistSong playlistSong : playlistSongs) {
                    Song song = songMapper.selectById(playlistSong.getSongId());
                    songs.add(song);
                }
                PlaylistVo playlistVo = new PlaylistVo();
                playlistVo.setSongs(songs);
                playlistVo.setName(playlist.getName());
                playlistVo.setCover(playlist.getCover());
                playlistVo.setBackgroundColor(playlist.getBackgroundColor());
                playlistVo.setId(playlist.getId());
                return RespBean.success(playlistVo);
            }
        }
        return RespBean.error(RespBeanEnum.PLAYLIST_NOT_FOUND);
    }

    @Override
    public RespBean addToPlaylist(AddToPlaylistVo vo) {
        Playlist playlist = playlistMapper.selectById(vo.getPlaylistId());
        if (playlist != null) {
            if (playlist.getUserId().equals(vo.getUserId())) {
                PlaylistSong playlistSong = new PlaylistSong();
                playlistSong.setPlaylistId(playlist.getId());
                playlistSong.setSongId(vo.getSongId());
                playlistSongMapper.insert(playlistSong);
                return RespBean.success();
            }
        }
        return RespBean.error(RespBeanEnum.ADD_TO_PLAYLIST_FAILED);
    }

    @Override
    public RespBean cancelPlaylist(AddToPlaylistVo vo) {
        Playlist playlist = playlistMapper.selectById(vo.getPlaylistId());
        if (playlist != null) {
            if (playlist.getUserId().equals(vo.getUserId())) {
                playlistSongMapper.delete(new QueryWrapper<PlaylistSong>()
                        .eq("playlist_id", playlist.getId())
                        .eq("song_id", vo.getSongId()));
                return RespBean.success();
            }
        }
        return RespBean.error(RespBeanEnum.CANCEL_PLAYLIST_FAILED);
    }
}
