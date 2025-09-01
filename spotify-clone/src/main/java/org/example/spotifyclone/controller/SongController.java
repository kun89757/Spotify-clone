package org.example.spotifyclone.controller;

import org.example.spotifyclone.service.ISongService;
import org.example.spotifyclone.vo.RespBean;
import org.example.spotifyclone.vo.songVo.AddVo;
import org.example.spotifyclone.vo.songVo.UpdateVo;
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
@RequestMapping("/song")
public class SongController {
    @Autowired
    private ISongService songService;

    @PostMapping("/addSong")
    public RespBean addSong(@RequestBody AddVo song) throws Exception {
        return songService.addSong(song);
    }

    @GetMapping("/getSongById")
    public RespBean getSongById(@RequestParam String id) {
        return songService.getSongById(id);
    }

    @PostMapping("/uploadAudio")
    public RespBean uploadAudio(@RequestParam("file") MultipartFile file) throws Exception {
        return songService.uploadAudio(file);
    }

    @PostMapping("/uploadImage")
    public RespBean uploadImage(@RequestBody MultipartFile file) throws Exception {
        return songService.uploadImage(file);
    }

    @GetMapping("/getList")
    public RespBean getList() {
        return songService.getList();
    }

    @DeleteMapping("/deleteById")
    public RespBean deleteSongById(@RequestParam("id") String id) {
        return songService.deleteById(id);
    }

    @GetMapping("/getSongsByAlbum")
    public RespBean getSongsByAlbum(@RequestParam("albumId") String albumId) {
        return songService.getSongsByAlbum(albumId);
    }

    @PostMapping("/batchImport")
    public RespBean batchImport(@RequestParam("file") MultipartFile file) {
        return songService.batchImport(file);
    }

    @PostMapping("/updateSong")
    public RespBean updateSong(@RequestBody UpdateVo updateVo) throws Exception {
        return songService.updateSong(updateVo);
    }

    @PostMapping("/test")
    public RespBean test() {
        return songService.test();
    }
}
