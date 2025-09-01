package org.example.spotifyclone.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public enum RespBeanEnum {
    SUCCESS(200, "成功"),

    ERROR(500, "服务端异常"),

    MISSING_FILE(501, "找不到文件"),

    ARTIST_NOT_FOUND(502, "无对应艺术家"),

    ALBUM_NOT_FOUND(503, "无对应专辑"),

    MISMATCH_SONG_ID(504, "无对应歌曲"),

    ALBUM_ALREADY_EXISTS(505, "专辑已存在"),

    TRACK_ALREADY_EXISTS(506, "单曲已存在"),

    SONGS_NOT_FOUND(507, "找不到歌曲"),

    LOGIN_FAILED(508, "登陆失败"),

    INCORRECT_EMAIL(509, "请输入正确的邮箱"),

    USERNAME_ALREADY_EXIST(510, "用户名重复"),

    USER_ALREADY_EXIST(511, "用户已存在"),

    PLAYLIST_NOT_FOUND(512, "找不到播放列表"),

    ADD_TO_PLAYLIST_FAILED(513, "添加失败"),

    CANCEL_PLAYLIST_FAILED(514, "取消失败");

    private final long code;
    private final String message;

}
