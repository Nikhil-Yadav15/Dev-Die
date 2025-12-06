



import { useState, useContext } from 'react';
import { Button, TextField, Box, Typography, Paper, Grid } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { login, googleLogin } = useContext(AuthContext);

  const handleLoginAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      console.log(err);
      let message = "Login failed. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: `linear-gradient(rgba(0,0,0,0.90), rgba(0,0,0,0.96)),url('/gradient.jpg') center/cover no-repeat fixed`
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{
          flexDirection: { xs: 'column-reverse', md: 'row' },
          minHeight: "80vh",
          maxWidth: 1850
        }}
        spacing={4}
      >
        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              maxWidth: 450,
              p: { xs: 3, md: 5 },
              bgcolor: "#18181bfa",
              color: "#fff",
              border: "1.5px solid #FFD70044",
              boxShadow: "0 0 40px #FFD70033"
            }}
          >
            <Typography
              variant="h4"
              fontWeight={900}
              mb={3}
              textAlign="center"
              color="gold"
              sx={{ fontSize: { xs: 24, md: 32 } }}
            >
              Welcome Back
            </Typography>

          
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={googleLogin}
                onError={() => setError("Google login failed")}
                theme="filled_blue"
                size="large"
                shape="pill"
                text="continue_with"
                width="100%"
              />
            </Box>

            <Typography
              align="center"
              sx={{ color: "#FFD700bb", mb: 3, fontSize: { xs: 16, md: 18 } }}
            >
              Or log in manually with your account
            </Typography>

            <form onSubmit={handleLoginAuth} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
                sx={{
                  mb: 2,
                  bgcolor: "#23232b",
                  border: "1.5px solid #FFD70099",
                  input: { color: "#FFD700", fontSize: 18, height: "26px", padding: "14px 10px" }
                }}
                InputLabelProps={{ style: { color: "#FFD700bb", fontSize: 16 } }}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                required
                onChange={e => setPassword(e.target.value)}
                sx={{
                  mb: 2,
                  bgcolor: "#23232b",
                  border: "1.5px solid #FFD70099",
                  input: { color: "#FFD700", fontSize: 18, height: "26px", padding: "14px 10px" }
                }}
                InputLabelProps={{ style: { color: "#FFD700bb", fontSize: 16 } }}
                fullWidth
              />
              {error && <Typography color="error" textAlign="center" fontSize={16}>{error}</Typography>}

              <Typography
                align="center"
                sx={{ fontSize: 16, color: "#FFD70088" }}
              >
                Don't have an account?{" "}
                <a href="/register" style={{ color: "#FFD700", textDecoration: 'underline' }}>Create your account</a>
              </Typography>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "100%", height: 48, mt: 2,
                  background: "linear-gradient(90deg, #FFD700 0%, #B87333 100%)",
                  color: "#18181b", fontWeight: 700, fontSize: 18,
                  boxShadow: "0 0 12px #FFD700a3",
                  "&:hover": { background: "#FFD700", color: "#0a0a0a" }
                }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: { xs: "center", md: "flex-start" },
            px: { xs: 2, md: 6 }, py: { xs: 4, md: 2 },
            minHeight: { xs: "auto", md: 740 }
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 760, p: { xs: 0, md: 2 } }}>
            <Typography
              sx={{
                color: '#FFD700',
                fontWeight: 700,
                fontSize: { xs: 32, md: 52 },
                mb: 2,
                lineHeight: 1.2
              }}
            >
              MEDICO
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: 34, md: 58 },
                color: "#fff",
                lineHeight: 1.1,
                mb: 2
              }}
            >
              Your health, on time...
            </Typography>
            <Typography
              sx={{
                color: "#FFD700",
                fontSize: { xs: 22, md: 34 },
                mb: 3,
                fontWeight: 800,
                letterSpacing: 0.5
              }}
            >
              Track. Remind. Stay Well!
            </Typography>
            <Typography
              sx={{
                color: '#bbb',
                fontSize: { xs: 17, md: 23 },
                mb: 6,
                fontWeight: 500
              }}
            >
              Medico empowers your health journey with timely medicine reminders, personalized dashboards, and holistic tools for everyday well-being and balance.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

