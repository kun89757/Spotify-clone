package org.example.spotifyclone.controller;

import org.example.spotifyclone.service.IArtistService;
import org.example.spotifyclone.vo.RespBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-20
 */
@RestController
@RequestMapping("/artist")
public class ArtistController {

    @Autowired
    private IArtistService artistService;

    @GetMapping("/getAllArtists")
    public RespBean getAllArtists() {
        return artistService.getAllArtists();
    }

    @GetMapping("/getArtistById")
    public RespBean getArtistById(@RequestParam String id) {
        return artistService.getArtistById(id);
    }
}
