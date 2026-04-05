'use client';

import { register } from '@/actions/register';
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Google, GitHub } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await register(
        formData.username,
        formData.password,
        formData.email
      );

      if (result?.error) {
        setMessage({
          type: 'error',
          text: result.error,
        });
      } else if (result?.success) {
        setMessage({
          type: 'success',
          text: result.success,
        });

        // Clear form on success
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper
        elevation={1}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          backgroundColor: '#ffffff',
          border: '1px solid',
          borderColor: 'rgba(99, 102, 241, 0.1)',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Create Account
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            Join us today and get started
          </Typography>
        </Box>

        {/* Message Alert */}
        {message && (
          <Alert
            severity={message.type}
            sx={{
              mb: 3,
              borderRadius: 1.5,
              fontWeight: 500,
              animation: 'slideDown 0.3s ease-out',
              '@keyframes slideDown': {
                from: {
                  opacity: 0,
                  transform: 'translateY(-10px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            {message.text}
          </Alert>
        )}

        {/* Register Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <Stack spacing={2.5}>
            {/* Username Field */}
            <TextField
              fullWidth
              label="Full Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              placeholder="John Doe"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                  },
                },
              }}
            />

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="you@example.com"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                  },
                },
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="••••••••"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleShowPassword}
                      edge="end"
                      disabled={loading}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        },
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: 20 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                  },
                },
              }}
            />

            {/* Confirm Password Field */}
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              placeholder="••••••••"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleShowConfirmPassword}
                      edge="end"
                      disabled={loading}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        },
                      }}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff sx={{ fontSize: 20 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                  },
                },
              }}
            />

            {/* Register Button */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Create Account'
              )}
            </Button>
          </Stack>
        </Box>

        {/* Divider */}
        <Divider
          sx={{
            my: 3,
            '&::before, &::after': {
              borderColor: 'rgba(99, 102, 241, 0.2)',
            },
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary', px: 1 }}>
            Or continue with
          </Typography>
        </Divider>

        {/* OAuth Buttons */}
        <Stack spacing={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              borderColor: 'rgba(99, 102, 241, 0.2)',
              color: 'text.primary',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#db4437',
                backgroundColor: 'rgba(219, 68, 55, 0.05)',
              },
              '&:disabled': {
                borderColor: 'rgba(99, 102, 241, 0.2)',
              },
            }}
          >
            Sign in with Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHub />}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              borderColor: 'rgba(99, 102, 241, 0.2)',
              color: 'text.primary',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#1f2937',
                backgroundColor: 'rgba(31, 41, 55, 0.05)',
              },
              '&:disabled': {
                borderColor: 'rgba(99, 102, 241, 0.2)',
              },
            }}
          >
            Sign in with GitHub
          </Button>
        </Stack>

        {/* Sign In Link */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Already have an account?{' '}
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: '#6366f1',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#8b5cf6',
                },
              }}
            >
              Sign in
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
