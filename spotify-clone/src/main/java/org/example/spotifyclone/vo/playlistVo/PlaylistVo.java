package org.example.spotifyclone.vo.playlistVo;

import lombok.Data;
import org.example.spotifyclone.entity.Song;

import java.util.List;

@Data
public class PlaylistVo {
    private Long id;

    private String name;

    private List<Song> songs;

    private String cover;

    private String backgroundColor;
}
