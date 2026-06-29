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
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: "16px", mx: 0.5, bgcolor: "#FFFFFF" } }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, fontSize: "1.05rem", color: '#FF6B35', pb: 0.5, pt: 2.5 }}>
        Welcome to KaEatSaan!
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pb: 3, px: 2.5 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 2.5 }}>
          Sign in to add kainan and write reviews
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: "0.72rem" }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="outlined"
          startIcon={isLoading ? <CircularProgress size={16} /> : <GoogleIcon sx={{ fontSize: "1rem !important" }} />}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          sx={{
            borderRadius: "9999px",
            fontWeight: 700,
            fontSize: "0.78rem",
            borderColor: '#dadce0',
            color: '#3c4043',
            '&:hover': { borderColor: '#d2e3fc', backgroundColor: '#f8faff' },
          }}
        >
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
