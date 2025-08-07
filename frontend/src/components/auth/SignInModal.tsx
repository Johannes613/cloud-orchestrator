import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Google as GoogleIcon, Close as CloseIcon } from '@mui/icons-material';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ open, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
      navigate('/app');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
      navigate('/app');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setIsSignUp(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="signin-modal-title"
      aria-describedby="signin-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: '#1a1a1a',
          border: '1px solid rgba(94, 106, 210, 0.5)',
          borderRadius: 3,
          boxShadow: '0 0 25px rgba(94, 106, 210, 0.3)',
          p: 4,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff' }}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#f44336' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleEmailSignIn}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#5E6AD2' },
                color: '#ffffff',
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#5E6AD2' },
                color: '#ffffff',
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            }}
          />
                     <Button
             type="submit"
             fullWidth
             variant="contained"
             disabled={loading}
             sx={{
               mb: 3,
               bgcolor: '#ffffff',
               color: '#000000',
               fontWeight: 600,
               py: 1.5,
               '&:hover': {
                 bgcolor: '#f5f5f5',
               },
               '&:disabled': {
                 bgcolor: 'rgba(255, 255, 255, 0.5)',
                 color: 'rgba(0, 0, 0, 0.5)',
               },
             }}
           >
             {loading ? (
               <CircularProgress size={24} sx={{ color: '#000000' }} />
             ) : (
               isSignUp ? 'Create Account' : 'Sign In'
             )}
           </Button>
        </form>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            OR
          </Typography>
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleSignIn}
          disabled={loading}
          startIcon={<GoogleIcon />}
          sx={{
            mb: 3,
            borderColor: 'rgba(255,255,255,0.3)',
            color: '#ffffff',
            fontWeight: 600,
            py: 1.5,
            '&:hover': {
              borderColor: '#ffffff',
              bgcolor: 'rgba(255,255,255,0.05)',
            },
            '&:disabled': {
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.3)',
            },
          }}
        >
          Continue with Google
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Typography>
          <Button
            onClick={() => setIsSignUp(!isSignUp)}
            sx={{
              color: '#5E6AD2',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                color: '#4a5bc0',
              },
            }}
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SignInModal; 