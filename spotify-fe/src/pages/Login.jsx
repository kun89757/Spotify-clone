import React from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Link, Box, styled } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets.js';

const Login = () => {
  const [ account , setAccount ] = React.useState('');
  const [ loginPassword , setLoginPassword ] = React.useState('');
  const [ username , setUsername ] = React.useState('');
  const [ email , setEmail ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  const [ repeatPassword, setRepeat ] = React.useState('');
  const [ loggingIn, setLoggingIn ] = React.useState(true);
  const navigate = useNavigate();

  const CssTextField = styled(TextField)`
  & label {
      color: white;
  }
  & label.Mui-focused {
      color: white;
  }
  & .MuiOutlinedInput-root {
      & fieldset {
          border-color: white;
      }
      &:hover fieldset {
          border-color: white;
      }
      &.Mui-focused fieldset {
          border-color: white;
      }
  }`

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loggingIn) {
      const data = {
        username: account,
        password: loginPassword,
      }
      const response = await axios.post('http://localhost:8888/user/login', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.code === 200) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userId', response.data.data.userId);
        navigate('/');
        location.reload();
      } else {
        toast.error(response.data.message);
        console.error(response.data.message);
      }
    } else {
      if (repeatPassword !== password) {
        toast.error('二次密码不一致');
        return;
      }
      const data = {
        username: username,
        email: email,
        password: password,
      }
      const response = await axios.post('http://localhost:8888/user/register', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.code === 200) {
        setLoggingIn(true);
        toast.success("注册成功");
      } else {
        toast.error(response.data.message);
      }
    }
  }

  const handleAuth = async () => {
    const clientId = "44598900a98b417a9b92cea35b4cb5fd";
    async function redirectToAuthCodeFlow(clientId) {
      const verifier = generateCodeVerifier(128);
      const challenge = await generateCodeChallenge(verifier);

      localStorage.setItem("verifier", verifier);

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("response_type", "code");
      params.append("redirect_uri", "http://localhost:3000/");
      params.append("scope", "playlist-read-private streaming user-read-private user-read-email");
      params.append("code_challenge_method", "S256");
      params.append("code_challenge", challenge);

      document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }
    function generateCodeVerifier(length) {
      let text = '';
      let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    async function generateCodeChallenge(codeVerifier) {
      const data = new TextEncoder().encode(codeVerifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
    async function getAccessToken(clientId, code) {
      const verifier = localStorage.getItem("verifier");

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", "http://localhost:3000/");
      params.append("code_verifier", verifier);

      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
      });

      const { access_token } = await result.json();
      return access_token;
    }
    const response = await redirectToAuthCodeFlow(clientId);
    console.log(response);
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const accessToken = await getAccessToken(clientId, code);
    console.log(accessToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userId', 1);
    navigate('/');
  }

  return (
    <Container className={'pt-10'} component="main" maxWidth="md">
      <Paper className={'pt-12 h-[80vh]'} elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'black' }}>
        <Typography className={'text-white'} component="h1" variant="h5" gutterBottom>
          { loggingIn ? '登录到Spotify' : '注册' }
        </Typography>
        { loggingIn && (
          <Box display={ 'flex' } flexDirection={ 'column' } alignItems={ 'center' } textAlign='center'
               className={ ' mt-10 border-b-2 w-[50%] h-[20vh]' }>
            <img className={'scale-150'} alt={ '' } src={ assets.spotify_logo }/>
            <Box className={'mt-5'}>
              <Button onClick={ handleAuth } size='large' color='success' variant="contained"
                      sx={ { mt: 3, mb: 2, color: 'black', fontWeight: 'bold' } }>
                使用Spotify授权登录
              </Button>
            </Box>
          </Box>
        )
        }
        <Box className={'mt-15'} textAlign='center' component="form" onSubmit={ handleSubmit} sx={{ width: '50%' }}>
          {
            loggingIn ? (
              <>
                <CssTextField
                  margin="normal"
                  key='1'
                  required
                  fullWidth
                  variant='outlined'
                  id="account"
                  label="用户名"
                  sx={{ input: { color: 'white' } }}
                  name="account"
                  autoComplete="email"
                  defaultValue={account}
                  onBlur={(e) => setAccount(e.target.value)}
                />
                <CssTextField
                  margin="normal"
                  key='2'
                  required
                  fullWidth
                  variant="outlined"
                  name="loginPassword"
                  label="密码"
                  defaultValue={loginPassword}
                  type="password"
                  id="loginPassword"
                  sx={{ input: { color: 'white' } }}
                  autoComplete="current-password"
                  onBlur={(e) => {
                    setLoginPassword(e.target.value);
                  }}
                />
              </>
            ) : (
              <>
                <CssTextField
                  margin="normal"
                  key='3'
                  required
                  fullWidth
                  variant='outlined'
                  id="username"
                  label="用户名"
                  sx={{ input: { color: 'white' } }}
                  name="username"
                  defaultValue={username}
                  onBlur={(e) => setUsername(e.target.value)}
                />
                <CssTextField
                  margin="normal"
                  key='4'
                  required
                  fullWidth
                  variant="outlined"
                  name="email"
                  label="邮箱地址"
                  id="email"
                  sx={{ input: { color: 'white' } }}
                  autoComplete="email"
                  defaultValue={email}
                  onBlur={(e) => setEmail(e.target.value)}
                />
                <CssTextField
                  margin="normal"
                  key='5'
                  required
                  fullWidth
                  variant='outlined'
                  id="password"
                  label="密码"
                  sx={{ input: { color: 'white' } }}
                  name="password"
                  type="password"
                  defaultValue={password}
                  onBlur={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <CssTextField
                  margin="normal"
                  key='6'
                  required
                  fullWidth
                  variant="outlined"
                  name="repeatPassword"
                  label="请再次输入密码"
                  type="password"
                  id="repeatPassword"
                  sx={{ input: { color: 'white' } }}
                  defaultValue={repeatPassword}
                  onBlur={(e) => setRepeat(e.target.value)}
                />
              </>
            )
          }
          <Button size='large' type="submit" color='success' variant="contained" sx={{ mt: 3, mb: 2, color: 'black', fontWeight: 'bold' }}>
            { loggingIn ? '登录' : '注册'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              { loggingIn ? (
                <Link color={'white'} underline={'none'} variant="body2" onClick={() => setLoggingIn(false)}>
                  还没有账号？注册一个新账号
                </Link>
              ) : (
                <Link color={'white'} underline={'none'} variant="body2" onClick={() => setLoggingIn(true)}>
                  已经有账号了？返回登录
                </Link>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
