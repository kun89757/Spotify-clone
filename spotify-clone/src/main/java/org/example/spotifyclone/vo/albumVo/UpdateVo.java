package org.example.spotifyclone.vo.albumVo;

import lombok.Data;

@Data
public class UpdateVo {
    private Long id;

    private String name;

    private Long artistId;

    private String description;

    private String backgroundColor;

    private String coverName;
}
