package org.example.spotifyclone.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {
    @PostMapping("upload")
    public void upload(MultipartFile file) throws Exception {
        Dotenv dotenv = Dotenv.load();
        Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
        cloudinary.config.secure = true;
        System.out.println(cloudinary.config.cloudName);
        Map map = ObjectUtils.asMap(
                "use_filename", true,
                "unique_filename", false,
                "overwrite", true
        );
        System.out.println(cloudinary.uploader().upload("https://cloudinary-devs.github.io/cld-docs-assets/assets/images/coffee_cup.jpg", map));
        Map map2 = ObjectUtils.asMap(
                "quality_analysis", true
        );
        System.out.println(cloudinary.api().resource("coffee_cup", map2));
    }
//
//    @PostMapping("/")
//    public Mono<String> test() {
//        return Mono.just("redirect:/oauth2/authorization.spotify");
//    }
}
