package org.example.spotifyclone.service.serviceImpl;

import org.example.spotifyclone.entity.Artist;
import org.example.spotifyclone.mapper.ArtistMapper;
import org.example.spotifyclone.service.IArtistService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.spotifyclone.vo.RespBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author nuwanda
 * @since 2024-07-20
 */
@Service
public class ArtistServiceImpl extends ServiceImpl<ArtistMapper, Artist> implements IArtistService {

    @Autowired
    private ArtistMapper artistMapper;

    @Override
    public RespBean getAllArtists() {
        return RespBean.success(artistMapper.selectList(null));
    }

    @Override
    public RespBean getArtistById(String id) {
        return RespBean.success(artistMapper.selectById(id));
    }


}
