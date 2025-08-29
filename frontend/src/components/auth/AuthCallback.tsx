import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getCurrentUser } from '../../store/slices/authSlice';
import { useToast } from '../../hooks/use-toast';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    const processCallback = async () => {
      console.log('[AuthCallback] Starting processCallback');
      try {
        const user = await dispatch(getCurrentUser()).unwrap();
        console.log('[AuthCallback] getCurrentUser success:', user);
        toast({
          title: "Success",
          description: "Successfully logged in!",
        });
        const returnUrl = localStorage.getItem('returnUrl') || '/dashboard';
        localStorage.removeItem('returnUrl');
        console.log('[AuthCallback] Navigating to', returnUrl);
        navigate(returnUrl, { replace: true });
      } catch (error: any) {
        console.log('[AuthCallback] getCurrentUser error:', error);
        toast({
          title: "Authentication Error",
          description: error || "Failed to complete authentication",
          variant: "destructive",
        });
        console.log('[AuthCallback] Navigating to /login');
        navigate('/login', { replace: true });
      }
    };
    processCallback();
  }, [dispatch, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Authentication failed: {error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="text-primary hover:underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}