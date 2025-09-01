package org.example.spotifyclone.controller;

import org.example.spotifyclone.service.IPlaylistService;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.playlistVo.AddToPlaylistVo;
import org.example.spotifyclone.vo.playlistVo.GetPlaylistVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-23
 */
@RestController
@RequestMapping("/playlist")
public class PlaylistController {
    @Autowired
    private IPlaylistService playlistService;

    @PostMapping("/getPlaylist")
    public RespBean getPlaylist(@RequestBody GetPlaylistVo vo) {
        return playlistService.getPlayList(vo);
    }

    @PostMapping("/addToPlaylist")
    public RespBean addToPlaylist(@RequestBody AddToPlaylistVo vo) {
        return playlistService.addToPlaylist(vo);
    }

    @PostMapping("/cancelPlaylist")
    public RespBean cancelPlaylist(@RequestBody AddToPlaylistVo vo) {
        return playlistService.cancelPlaylist(vo);
    }
}
