import { useState, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

import { AuthContext } from '../contexts/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { register, googleLogin } = useContext(AuthContext);

  const handleRegisterAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(name, email, password);
      setMessage('Account created successfully.');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
        background:
          'radial-gradient(circle at 90% 10%, #0ea5e9 0%, #0f172a 35%, #020617 80%)',
      }}
    >
      <Grid
        container
        alignItems="stretch"
        justifyContent="center"
        sx={{
          maxWidth: 1200,
          width: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(148,163,184,0.3)',
          boxShadow:
            '0 32px 80px rgba(15, 23, 42, 0.9), 0 0 0 1px rgba(15,23,42,0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left: Glass Register Panel */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 4 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 420,
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: '1px solid rgba(148,163,184,0.45)',
              background:
                'linear-gradient(145deg, rgba(15,23,42,0.92), rgba(15,23,42,0.80))',
              boxShadow:
                '0 22px 50px rgba(15,23,42,0.95), 0 0 0 1px rgba(30,64,175,0.6)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#e5e7eb',
                  mb: 0.5,
                }}
              >
                Create your Medico account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#9ca3af',
                }}
              >
                Set up your profile to start receiving smart medication
                reminders and health insights.
              </Typography>
            </Box>

            {/* Google Login Button */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={googleLogin}
                onError={() => setError('Google login failed')}
                theme="outline"
                size="large"
                shape="pill"
                text="continue_with"
                width="100%"
              />
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(148,163,184,0.6)' }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontSize: 11,
                }}
              >
                or register with email
              </Typography>
            </Divider>

            <form
              onSubmit={handleRegisterAuth}
              style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
            >
              <TextField
                label="Full name"
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.2,
                    backgroundColor: 'rgba(15,23,42,0.85)',
                    color: '#e5e7eb',
                    '& fieldset': {
                      borderColor: 'rgba(148,163,184,0.7)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#38bdf8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#22c55e',
                      boxShadow: '0 0 0 1px rgba(34,197,94,0.4)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9ca3af',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: 15,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    '&.Mui-focused': { color: '#e5e7eb' },
                  },
                }}
              />

              <TextField
                label="Email address"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.2,
                    backgroundColor: 'rgba(15,23,42,0.85)',
                    color: '#e5e7eb',
                    '& fieldset': {
                      borderColor: 'rgba(148,163,184,0.7)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#38bdf8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#22c55e',
                      boxShadow: '0 0 0 1px rgba(34,197,94,0.4)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9ca3af',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: 15,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    '&.Mui-focused': { color: '#e5e7eb' },
                  },
                }}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.2,
                    backgroundColor: 'rgba(15,23,42,0.85)',
                    color: '#e5e7eb',
                    '& fieldset': {
                      borderColor: 'rgba(148,163,184,0.7)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#38bdf8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#22c55e',
                      boxShadow: '0 0 0 1px rgba(34,197,94,0.4)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9ca3af',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: 15,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    '&.Mui-focused': { color: '#e5e7eb' },
                  },
                }}
              />

              {error && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fecaca',
                    textAlign: 'center',
                    mt: 0.5,
                  }}
                >
                  {error}
                </Typography>
              )}

              {message && !error && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#bbf7d0',
                    textAlign: 'center',
                    mt: 0.5,
                  }}
                >
                  {message}
                </Typography>
              )}

              <Typography
                align="center"
                sx={{ fontSize: 14, color: '#9ca3af', mt: 1 }}
              >
                Already have an account?{' '}
                <a
                  href="/login"
                  style={{
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign in
                </a>
              </Typography>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: '100%',
                  height: 48,
                  mt: 2,
                  borderRadius: 999,
                  background:
                    'linear-gradient(90deg, #0284c7 0%, #0ea5e9 50%, #22c55e 100%)',
                  color: '#e5e7eb',
                  fontWeight: 600,
                  fontSize: 15,
                  textTransform: 'none',
                  boxShadow:
                    '0 18px 40px rgba(8,47,73,0.9), 0 0 0 1px rgba(15,23,42,0.9)',
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #0369a1 0%, #0284c7 50%, #16a34a 100%)',
                    boxShadow:
                      '0 22px 48px rgba(8,47,73,1), 0 0 0 1px rgba(15,23,42,1)',
                  },
                }}
                fullWidth
              >
                Create account
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Right: Brand / Info Panel */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            position: 'relative',
            p: { xs: 4, md: 6 },
            color: '#e5f0ff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles / orbits */}
          <Box
            sx={{
              position: 'absolute',
              width: 260,
              height: 260,
              borderRadius: '50%',
              border: '1px solid rgba(59,130,246,0.4)',
              top: -40,
              right: -60,
              opacity: 0.55,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 420,
              height: 420,
              borderRadius: '50%',
              border: '1px solid rgba(45,212,191,0.35)',
              bottom: -120,
              left: -60,
              opacity: 0.4,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 20% 0%, rgba(56,189,248,0.22) 0, transparent 55%), radial-gradient(circle at 80% 80%, rgba(34,197,94,0.18) 0, transparent 50%)',
              opacity: 0.9,
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 540 }}>
            <Typography
              sx={{
                color: '#bae6fd',
                fontWeight: 700,
                fontSize: { xs: 18, md: 22 },
                letterSpacing: 2,
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              MEDICO
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: 26, md: 38 },
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              Start your journey to safer, smarter medication management.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#cbd5f5',
                fontSize: { xs: 14, md: 16 },
                mb: 4,
              }}
            >
              Create an account to sync your schedules across devices, receive
              timely reminders, and share adherence trends with the people who
              care for you—family or clinicians.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(148,163,184,0.35)',
                    background:
                      'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,118,110,0.35))',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 0.5 }}
                  >
                    Personalized schedules
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#cbd5f5', fontSize: 13 }}
                  >
                    Set up dose times, frequencies, and reminders tailored to
                    your treatment plan.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(148,163,184,0.35)',
                    background:
                      'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(37,99,235,0.35))',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 0.5 }}
                  >
                    Shared peace of mind
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#cbd5f5', fontSize: 13 }}
                  >
                    Allow caregivers or clinicians to view adherence summaries
                    and support you better.
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 4,
                color: '#94a3b8',
                fontSize: 11,
              }}
            >
              Designed to complement professional medical advice—not replace it.
              Always consult your healthcare provider for treatment decisions.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
