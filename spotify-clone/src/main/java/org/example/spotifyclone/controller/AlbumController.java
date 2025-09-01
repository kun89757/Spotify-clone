package org.example.spotifyclone.controller;

import org.example.spotifyclone.entity.Album;
import org.example.spotifyclone.service.IAlbumService;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.albumVo.AddAlbumVo;
import org.example.spotifyclone.vo.albumVo.UpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-20
 */
@RestController
@RequestMapping("/album")
public class AlbumController {

    @Autowired
    private IAlbumService albumService;

    @GetMapping("/getAllAlbums")
    public RespBean getAllAlbums() {
        return albumService.getAllAlbums();
    }

    @GetMapping("/getAlbumById")
    public RespBean getAlbumById(@RequestParam String id) {
        return albumService.getAlbumById(id);
    }

    @PostMapping("/addAlbum")
    public RespBean addAlbum(@RequestBody AddAlbumVo vo) throws Exception {
        return albumService.addAlbum(vo);
    }

    @PostMapping("/uploadCover")
    public RespBean uploadCover(@RequestParam MultipartFile file) throws Exception {
        return albumService.uploadCover(file);
    }

    @DeleteMapping("/removeById")
    public RespBean deleteById(@RequestParam String id) {
        return albumService.deleteById(id);
    }

    @PostMapping("/updateAlbum")
    public RespBean updateAlbum(@RequestBody UpdateVo vo) throws Exception {
        return albumService.updateAlbum(vo);
    }

}
