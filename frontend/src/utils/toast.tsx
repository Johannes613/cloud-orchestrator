import { toast } from 'react-toastify';

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  warning: (message: string) => toast.warning(message),
  info: (message: string) => toast.info(message),
};

export const showSignInPrompt = () => {
  toast.warning(
    <div>
      <div>Please sign in to access this feature</div>
      <a 
        href="/" 
        style={{ 
          color: '#1976d2', 
          textDecoration: 'underline',
          marginTop: '4px',
          display: 'inline-block'
        }}
      >
        Go to Landing Page
      </a>
    </div>,
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  );
}; 