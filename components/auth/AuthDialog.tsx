'use client';

import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthDialog({ open, onClose }: AuthDialogProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const { signIn, signUp, signInWithGoogle, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
      handleClose();
    } catch {
      // Error is handled in store
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      handleClose();
    } catch {
      // Error is handled in store
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    clearError();
    onClose();
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, color: '#980404' }}>
        {isSignUp ? 'Create Account' : 'Welcome Back!'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          sx={{
            mb: 2,
            borderColor: '#dadce0',
            color: '#3c4043',
            '&:hover': {
              borderColor: '#d2e3fc',
              backgroundColor: '#f8faff',
            },
          }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        <Box component="form" onSubmit={handleSubmit}>
          {isSignUp && (
            <TextField
              fullWidth
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
            />
          )}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={isLoading}
            inputProps={{ minLength: 6 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 2,
              backgroundColor: '#980404',
              '&:hover': {
                backgroundColor: '#7a0303',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isSignUp ? (
              'Sign Up'
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <Button
            onClick={toggleMode}
            sx={{ ml: 1, color: '#980404', textTransform: 'none' }}
            disabled={isLoading}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
