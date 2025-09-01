package org.example.spotifyclone.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.HashMap;
import java.util.Map;

public class JWTInterceptors implements HandlerInterceptor {
    @Override
    public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception {
        Map<String,Object> map = new HashMap<>();
        // 获取请求头中令牌
        String token = request.getHeader("token");
        String accessToken = request.getHeader("Authorization");
        try {
            // 放行请求
            if (accessToken == null || !accessToken.startsWith("Bearer")) {
                // 验证令牌
                JWTUtils.verify(token);
            }
            return true;
        } catch (Exception e){
            map.put("code", "5000");
            map.put("message","无效token");
        }
        map.put("success",false);

        String json = new ObjectMapper().writeValueAsString(map);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().println(json);
        return false;
    }
}
