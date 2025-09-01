package org.example.spotifyclone.vo.songVo;

import lombok.Data;

@Data
public class AddVo {
    private String name;

    private Long artistId;

    private Long albumId;

    private String description;

    private String audioName;

    private String imageName;

    private Boolean isSingle;
}
