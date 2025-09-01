package org.example.spotifyclone.vo.songVo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BatchVo {
    @JsonProperty("name")
    private String name;

    @JsonProperty("albumId")
    private Long albumId;

    private String description;

    @JsonProperty("artistId")
    private Long artistId;

    @JsonProperty("preview_url")
    private String playUrl;
}
