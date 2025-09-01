package org.example.spotifyclone.vo.albumVo;

import lombok.Data;

@Data
public class AddAlbumVo {
    private String name;

    private Long artistId;

    private String description;

    private String backgroundColor;

    private String coverName;
}
