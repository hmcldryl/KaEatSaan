'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthDialog({ open, onClose }: AuthDialogProps) {
  const { signInWithGoogle, isLoading, error, clearError } = useAuthStore();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      handleClose();
    } catch {
      // Error is handled in store
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, color: '#FF6B35', pb: 1 }}>
        Welcome to KaEatSaan!
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to add kainan and write reviews
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="outlined"
          startIcon={isLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          size="large"
          sx={{
            py: 1.5,
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
      </DialogContent>
    </Dialog>
  );
}
