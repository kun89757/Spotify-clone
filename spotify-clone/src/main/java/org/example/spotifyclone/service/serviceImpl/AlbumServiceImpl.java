package org.example.spotifyclone.service.serviceImpl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;
import org.example.spotifyclone.entity.Album;
import org.example.spotifyclone.entity.Song;
import org.example.spotifyclone.mapper.AlbumMapper;
import org.example.spotifyclone.mapper.ArtistMapper;
import org.example.spotifyclone.mapper.SongMapper;
import org.example.spotifyclone.service.IAlbumService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.spotifyclone.service.ISongService;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.RespBeanEnum;
import org.example.spotifyclone.vo.albumVo.AddAlbumVo;
import org.example.spotifyclone.vo.albumVo.UpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-20
 */
@Service
public class AlbumServiceImpl extends ServiceImpl<AlbumMapper, Album> implements IAlbumService {

    @Autowired
    private AlbumMapper albumMapper;

    @Autowired
    private ISongService songService;

    @Autowired
    private ArtistMapper artistMapper;
    @Autowired
    private SongMapper songMapper;

    @Override
    public RespBean getAllAlbums() {
        var list = albumMapper.selectList(null);
        return RespBean.success(list);
    }

    @Override
    public RespBean getAlbumById(String id) {
        return RespBean.success(albumMapper.selectById(id));
    }

    @Override
    @Transactional
    public RespBean addAlbum(AddAlbumVo vo) {
        //检查重复专辑
        QueryWrapper<Album> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("name", vo.getName());
        queryWrapper.eq("artist_id", vo.getArtistId());
        Album existingAlbum = albumMapper.selectOne(queryWrapper);
        if (existingAlbum != null) {
            return RespBean.error(RespBeanEnum.ALBUM_ALREADY_EXISTS);
        }

        Album album = new Album();
        album.setName(vo.getName());
        album.setBackgroundColor(vo.getBackgroundColor());
        album.setTrackCount(0L);
        var artist = artistMapper.selectById(vo.getArtistId());
        if (artist == null) {
            return RespBean.error(RespBeanEnum.ARTIST_NOT_FOUND);
        }
        album.setArtistId(vo.getArtistId());
        album.setDescription(vo.getDescription());
        Dotenv dotenv = Dotenv.load();
        Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
        cloudinary.config.secure = true;
        String coverRename = artist.getName() + "_" + vo.getName() + "_album_cover";
        Map coverOptions = ObjectUtils.asMap(
                "resource_type", "image",
                "display_name", coverRename
        );
        try {
            // 修改publicId
            cloudinary.uploader().rename(vo.getCoverName(), coverRename, coverOptions);
            // 修改displayName
            cloudinary.api().update(coverRename, coverOptions);
            var cover = cloudinary.api().resource(coverRename, coverOptions);
            System.out.println(cover);
            // 获取url和播放时长
            album.setImage((String) cover.get("secure_url"));
            albumMapper.insert(album);
        } catch (Exception e) {
            return RespBean.error(RespBeanEnum.valueOf(e.getMessage()));
        }
        return RespBean.success();
    }

    @Override
    public RespBean uploadCover(MultipartFile file) throws Exception {
        return songService.uploadImage(file);
    }

    @Override
    @Transactional
    public RespBean deleteById(String id) {
        try {
            Album album = albumMapper.selectById(id);
            if (album == null) {
                return RespBean.error(RespBeanEnum.ALBUM_NOT_FOUND);
            }
            QueryWrapper<Song> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("album_id", id);
            List<Song> songs = songService.list(queryWrapper);
            if (songs != null && !songs.isEmpty()) {
                for (Song song : songs) {
                    songMapper.deleteById(song.getId());
                }
            }
            albumMapper.deleteById(id);
            return RespBean.success();
        } catch (Exception e) {
            return RespBean.error(RespBeanEnum.valueOf(e.getMessage()));
        }
    }

    @Override
    @Transactional
    public RespBean updateAlbum(UpdateVo vo) throws Exception {
        Album album = albumMapper.selectById(vo.getId());
        if (album == null) {
            return RespBean.error(RespBeanEnum.ALBUM_NOT_FOUND);
        } else {
            album.setName(vo.getName());
            album.setBackgroundColor(vo.getBackgroundColor());
            var artist = artistMapper.selectById(vo.getArtistId());
            if (artist == null) {
                return RespBean.error(RespBeanEnum.ARTIST_NOT_FOUND);
            }
            album.setArtistId(vo.getArtistId());
            album.setDescription(vo.getDescription());
            if (vo.getCoverName() != null) {
                Dotenv dotenv = Dotenv.load();
                Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
                cloudinary.config.secure = true;
                String coverRename = artist.getName() + "_" + vo.getName() + "_album_cover_update";
                Map coverOptions = ObjectUtils.asMap(
                        "resource_type", "image",
                        "display_name", coverRename
                );
                // 修改publicId
                cloudinary.uploader().rename(vo.getCoverName(), coverRename, coverOptions);
                // 修改displayName
                cloudinary.api().update(coverRename, coverOptions);
                var cover = cloudinary.api().resource(coverRename, coverOptions);
                System.out.println(cover);
                // 获取url和播放时长
                album.setImage((String) cover.get("secure_url"));
            }
            albumMapper.updateById(album);
            return RespBean.success();
        }
    }
}
