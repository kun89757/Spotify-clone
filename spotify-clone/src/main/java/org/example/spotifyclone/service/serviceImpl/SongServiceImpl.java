package org.example.spotifyclone.service.serviceImpl;

import cn.hutool.core.io.StreamProgress;
import cn.hutool.http.HttpUtil;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import org.example.spotifyclone.entity.Album;
import org.example.spotifyclone.entity.Artist;
import org.example.spotifyclone.entity.Song;
import org.example.spotifyclone.mapper.AlbumMapper;
import org.example.spotifyclone.mapper.ArtistMapper;
import org.example.spotifyclone.mapper.SongMapper;
import org.example.spotifyclone.service.ISongService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.RespBeanEnum;
import org.example.spotifyclone.vo.songVo.AddVo;
import org.example.spotifyclone.vo.songVo.BatchVo;
import org.example.spotifyclone.vo.songVo.UpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-20
 */
@Service
public class SongServiceImpl extends ServiceImpl<SongMapper, Song> implements ISongService {

    @Autowired
    private SongMapper songMapper;
    @Autowired
    private ArtistMapper artistMapper;
    @Autowired
    private AlbumMapper albumMapper;

    @Override
    public RespBean getList() {
        return RespBean.success(songMapper.selectList(null));
    }


    @Override
    @Transactional
    public RespBean addSong(AddVo vo) throws Exception {
        QueryWrapper<Song> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("name", vo.getName());
        queryWrapper.eq("artist_id", vo.getArtistId());
        Song existingSong = songMapper.selectOne(queryWrapper);
        if (existingSong != null) {
            return RespBean.error(RespBeanEnum.TRACK_ALREADY_EXISTS);
        }

        Song song = new Song();
        song.setName(vo.getName());
        if (vo.getIsSingle()) {
            song.setAlbumId(0L);
        } else {
            var album = albumMapper.selectById(vo.getAlbumId());
            if (album == null) {
                return RespBean.error(RespBeanEnum.ALBUM_NOT_FOUND);
            } else {
                song.setAlbumId(vo.getAlbumId());
            }
        }
        var artist = artistMapper.selectById(vo.getArtistId());
        if (artist == null) {
            return RespBean.error(RespBeanEnum.ARTIST_NOT_FOUND);
        }
        song.setArtistId(vo.getArtistId());
        song.setDescription(vo.getDescription());
        Dotenv dotenv = Dotenv.load();
        Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
        cloudinary.config.secure = true;
        String audioRename = artist.getName() + "_" + vo.getName() + "_audio";
        String imageRename = artist.getName() + "_" + vo.getName() + "_image";
        Map audioOptions = ObjectUtils.asMap(
                "display_name", audioRename,
                "resource_type", "video",
                "media_metadata", true
        );
        Map imageOptions = ObjectUtils.asMap(
                "display_name", imageRename,
                "resource_type", "image",
                "media_metadata", true
        );
        // 修改publicId
        cloudinary.uploader().rename(vo.getAudioName(), audioRename, audioOptions);
        cloudinary.uploader().rename(vo.getImageName(), imageRename, imageOptions);
        // 修改displayName
        cloudinary.api().update(audioRename, audioOptions);
        cloudinary.api().update(imageRename, imageOptions);
        var audio = cloudinary.api().resource(audioRename, audioOptions);
        var image = cloudinary.api().resource(imageRename, imageOptions);
        // 获取url和播放时长
        song.setPlayUrl((String) audio.get("secure_url"));
        song.setImage((String) image.get("secure_url"));
        song.setDuration((Double) audio.get("audio_duration"));
        songMapper.insert(song);

        if(!vo.getIsSingle()) {
            var album = albumMapper.selectById(vo.getAlbumId());
            album.setTrackCount(album.getTrackCount() + 1);
            albumMapper.updateById(album);
        }
        return RespBean.success();
    }

    @Override
    public RespBean uploadImage(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            return RespBean.error(RespBeanEnum.MISSING_FILE);
        }
        return upload(file, "image");
    }

    @Override
    public RespBean uploadAudio(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            return RespBean.error(RespBeanEnum.MISSING_FILE);
        }
        return upload(file, "video");
    }

    @Override
    public RespBean deleteById(String id) {
        if (songMapper.deleteById(id) == 1) {
            Song song = songMapper.selectById(id);
            var albumId = song.getAlbumId();
            if (albumId != null) {
                Album album = albumMapper.selectById(albumId);
                album.setTrackCount(album.getTrackCount() - 1);
            }
            return RespBean.success();
        } else {
            return RespBean.error(RespBeanEnum.MISMATCH_SONG_ID);
        }
    }

    @Override
    public RespBean getSongsByAlbum(String albumId) {
        QueryWrapper<Song> wrapper = new QueryWrapper<>();
        wrapper.eq("album_id", albumId);
        List<Song> songs = songMapper.selectList(wrapper);

        if (songs == null || songs.isEmpty()) {
            return RespBean.error(RespBeanEnum.SONGS_NOT_FOUND);
        }
        return RespBean.success(songs);
    }

    @Override
    @Transactional
    public RespBean batchImport(MultipartFile file) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<BatchVo> batchVos = objectMapper.readValue(file.getInputStream(), new TypeReference<List<BatchVo>>() {});
            for (BatchVo batchVo : batchVos) {
                insertSingleVo(batchVo);
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return RespBean.success();
    }

    @Override
    @Transactional
    public RespBean test() {
        try {
            BatchVo vo = new BatchVo();
            vo.setName("test");
            vo.setDescription("test");
            vo.setAlbumId(7L);
            vo.setArtistId(2L);
            vo.setPlayUrl("https://p.scdn.co/mp3-preview/19091d2c79858c787fbdfc0f4c2b6f509b81114a?cid=44598900a98b417a9b92cea35b4cb5fd");
            insertSingleVo(vo);
        } catch (Exception e) {
            return RespBean.error(RespBeanEnum.ERROR);
        }
        return RespBean.success();
    }

    @Override
    @Transactional
    public RespBean updateSong(UpdateVo updateVo) throws Exception {
        QueryWrapper<Song> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("name", updateVo.getName());
        queryWrapper.eq("artist_id", updateVo.getArtistId());
        Song existingSong = songMapper.selectOne(queryWrapper);
        if (existingSong != null) {
            return RespBean.error(RespBeanEnum.TRACK_ALREADY_EXISTS);
        }
        Song song = songMapper.selectById(updateVo.getId());
        if (song == null) {
            return RespBean.error(RespBeanEnum.SONGS_NOT_FOUND);
        } else {
            song.setName(updateVo.getName());
            song.setDescription(updateVo.getDescription());
            if (updateVo.getIsSingle()) {
                song.setAlbumId(0L);
            } else {
                var album = albumMapper.selectById(updateVo.getAlbumId());
                if (album == null) {
                    return RespBean.error(RespBeanEnum.ALBUM_NOT_FOUND);
                } else {
                    song.setAlbumId(updateVo.getAlbumId());
                }
            }
            var artist = artistMapper.selectById(updateVo.getArtistId());
            if (artist == null) {
                return RespBean.error(RespBeanEnum.ARTIST_NOT_FOUND);
            }
            song.setArtistId(updateVo.getArtistId());
            if (updateVo.getImageName() != null || updateVo.getAudioName() != null) {
                Dotenv dotenv = Dotenv.load();
                Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
                cloudinary.config.secure = true;
                if (updateVo.getImageName() != null) {
                    String imageRename = artist.getName() + "_" + updateVo.getName() + "_update_image";
                    Map imageOptions = ObjectUtils.asMap(
                            "display_name", imageRename,
                            "resource_type", "image",
                            "media_metadata", true
                    );
                    cloudinary.uploader().rename(updateVo.getImageName(), imageRename, imageOptions);
                    cloudinary.api().update(imageRename, imageOptions);
                    var image = cloudinary.api().resource(imageRename, imageOptions);
                    song.setImage((String) image.get("secure_url"));
                }
                if (updateVo.getAudioName() != null) {
                    String audioRename = artist.getName() + "_" + updateVo.getName() + "_update_audio";
                    Map audioOptions = ObjectUtils.asMap(
                            "display_name", audioRename,
                            "resource_type", "video",
                            "media_metadata", true
                    );
                    cloudinary.uploader().rename(updateVo.getAudioName(), audioRename, audioOptions);
                    cloudinary.api().update(audioRename, audioOptions);
                    var audio = cloudinary.api().resource(audioRename, audioOptions);
                    song.setPlayUrl((String) audio.get("secure_url"));
                    song.setDuration((Double) audio.get("audio_duration"));
                }
            }
            if (!updateVo.getIsSingle() && !updateVo.getAlbumId().equals(song.getAlbumId())) {
                var album = albumMapper.selectById(updateVo.getAlbumId());
                album.setTrackCount(album.getTrackCount() + 1);
                albumMapper.updateById(album);
                album = albumMapper.selectById(song.getAlbumId());
                album.setTrackCount(album.getTrackCount() - 1);
                albumMapper.updateById(album);
            }
            songMapper.updateById(song);
            return RespBean.success();

        }
    }

    @Override
    public RespBean getSongById(String id) {
        Song song = songMapper.selectById(id);
        if (song == null) {
            return RespBean.error(RespBeanEnum.SONGS_NOT_FOUND);
        } else {
            return RespBean.success(song);
        }
    }


    @Transactional
    public void insertSingleVo(BatchVo vo) throws Exception {
        QueryWrapper<Song> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("name", vo.getName());
        queryWrapper.eq("artist_id", vo.getArtistId());
        Song existingSong = songMapper.selectOne(queryWrapper);
        if (existingSong != null) {
            throw new Exception("歌曲已存在");
        }
        Song song = new Song();
        Artist artist = artistMapper.selectById(vo.getArtistId());
        if (artist == null) {
            throw new Exception("找不到艺术家");
        }
        Album album = albumMapper.selectById(vo.getAlbumId());
        if (album == null) {
            throw new Exception("找不到专辑");
        }
        Dotenv dotenv = Dotenv.load();
        Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
        cloudinary.config.secure = true;
        String audioRename = artist.getName() + "_" + vo.getName() + "_audio";
        Map audioOptions = ObjectUtils.asMap(
                "use_filename", true,
                "unique_filename", true,
                "overwrite", true,
                "display_name", audioRename,
                "public_id", audioRename,
                "resource_type", "video",
                "media_metadata", true
        );
        File file = download(vo.getPlayUrl());
        cloudinary.uploader().upload(file, audioOptions);
        file.delete();
        var audio = cloudinary.api().resource(audioRename, audioOptions);
        // 获取url和播放时长
        song.setPlayUrl((String) audio.get("secure_url"));
        song.setImage(album.getImage());
        song.setDuration((Double) audio.get("audio_duration"));
        song.setName(vo.getName());
        song.setArtistId(vo.getArtistId());
        song.setAlbumId(vo.getAlbumId());
        song.setDescription(vo.getDescription());
        song.setDuration((Double) audio.get("audio_duration"));
        songMapper.insert(song);
        album.setTrackCount(album.getTrackCount() + 1);
        albumMapper.updateById(album);
    }

    private File download(String url) {
        String newName = String.format("%s-%s", System.currentTimeMillis(), UUID.randomUUID());
        String extension = ".mp3";
        File file = HttpUtil.downloadFileFromUrl(url, new File("/temp/" + newName + extension), new StreamProgress() {
            @Override
            public void start() {
            }
            @Override
            public void progress(long total, long progressSize) {
            }
            // 下载成功
            @Override
            public void finish() {
                System.out.println("success!");
            }
        });
        return file;
    }

    private RespBean upload(MultipartFile file, String type) throws Exception {
        Dotenv dotenv = Dotenv.load();
        Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
        cloudinary.config.secure = true;
        Map map = ObjectUtils.asMap(
                "use_filename", true,
                "unique_filename", true,
                "overwrite", true,
                "resource_type", type,
                "transformation", new Transformation().width(300).height(300).crop("fill")
        );
        var result = cloudinary.uploader().upload(file.getBytes(), map);
        return RespBean.success(result.get("public_id"));
    }
}
