package org.example.spotifyclone.vo.playlistVo;

import lombok.Data;

@Data
public class AddToPlaylistVo {
    private Long userId;

    private Long playlistId;

    private Long songId;
}
