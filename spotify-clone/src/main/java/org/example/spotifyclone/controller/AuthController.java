package org.example.spotifyclone.controller;

import org.example.spotifyclone.vo.RespBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.view.RedirectView;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Value("${spotify.client.id}")
    private String SPOTIFY_CLIENT_ID;

    @Value("${spotify.client.secret}")
    private String SPOTIFY_CLIENT_SECRET;

    @Value("${spotify.redirect.uri}")
    private String REDIRECT_URI;

    private final WebClient webClient;

    public AuthController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://accounts.spotify.com").build();
    }

    @GetMapping("/login")
    public RespBean login() {
        return RespBean.success();
    }

    @GetMapping("/callback")
    public Mono<RedirectView> callback(@RequestParam("code") String code) {
        String authHeader = "Basic " + Base64.getEncoder()
                .encodeToString((SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).getBytes(StandardCharsets.UTF_8));

        return webClient.post()
                .uri("/api/token")
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("code", code)
                        .with("redirect_uri", REDIRECT_URI)
                        .with("grant_type", "authorization_code"))
                .retrieve()
                .bodyToMono(TokenResponse.class)
                .map(tokenResponse -> {
                    // Here you can handle the token response as needed
                    String accessToken = tokenResponse.getAccessToken();
                    return new RedirectView("/");
                });
    }

    @GetMapping("/token")
    public RespBean token() {
        return RespBean.success();
    }

    private static class TokenResponse {
        private String access_token;

        public String getAccessToken() {
            return access_token;
        }

        public void setAccessToken(String access_token) {
            this.access_token = access_token;
        }
    }
}
