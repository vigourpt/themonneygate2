import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "components/Button";
import { AuthForm } from "components/AuthForm";
import { getRedirectResult, AuthErrorCodes, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { firebaseAuth } from "app";
import { toast } from "sonner";
import { Toaster } from "components/Toast";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get("next");
  
  console.log("Login page loaded with next path:", nextPath);
  
  const [processingRedirect, setProcessingRedirect] = useState(true);

  // Check for redirect result when component mounts
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        console.log('Checking for redirect result...');
        const result = await getRedirectResult(firebaseAuth);
        
        if (result) {
          console.log('Successfully authenticated via redirect');
          
          // Check for stored redirect path first, then use next param, then fallback to dashboard
          const storedRedirectPath = localStorage.getItem('authRedirectPath');
          const redirectTo = storedRedirectPath || nextPath || '/dashboard';
          
          // Clear the stored path
          if (storedRedirectPath) {
            localStorage.removeItem('authRedirectPath');
          }
          
          console.log(`Redirecting to ${redirectTo}`);
          toast.success('Successfully signed in!');
          navigate(redirectTo);
        }
      } catch (error: any) {
        console.error('Error processing redirect result:', error);
        
        // Handle specific authentication errors
        if (error.code === AuthErrorCodes.POPUP_CLOSED_BY_USER) {
          toast.error('Authentication popup was closed. Please try again.');
        } else if (error.code === AuthErrorCodes.POPUP_BLOCKED) {
          toast.error('Authentication popup was blocked. Please allow popups for this site.');
        } else if (error.code === AuthErrorCodes.INVALID_CONTINUE_URI || 
                   error.code === AuthErrorCodes.UNAUTHORIZED_DOMAIN) {
          toast.error(`Authentication failed: This domain (${window.location.hostname}) is not authorized for Firebase authentication.`);
          console.error('Domain not authorized. Authorized domains should include:', window.location.hostname, 'databutton.com', 'themoneygate.com');
          
          // If we're in development mode and experiencing domain issues, offer a simple solution
          if (window.location.hostname.includes('localhost') || window.location.hostname.includes('databutton.com')) {
            console.log('Attempting manual sign-in for development environment...');
            // This helps when testing in development environments
            try {
              const provider = new GoogleAuthProvider();
              provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
              provider.addScope('https://www.googleapis.com/auth/userinfo.email');
              await signInWithRedirect(firebaseAuth, provider);
            } catch (fallbackErr) {
              console.error('Manual sign-in attempt failed:', fallbackErr);
            }
          }
        } else {
          toast.error('Authentication failed. Please try again.');
        }
      } finally {
        setProcessingRedirect(false);
      }
    };
    
    checkRedirectResult();
  }, [navigate, nextPath]);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User authenticated:', user.email);
        // Check for stored redirect path first, then use next param, then fallback to dashboard
        const storedRedirectPath = localStorage.getItem('authRedirectPath');
        const redirectTo = storedRedirectPath || nextPath || '/dashboard';
        
        // Clear the stored path
        if (storedRedirectPath) {
          localStorage.removeItem('authRedirectPath');
        }
        
        console.log(`User is signed in, redirecting to: ${redirectTo}`);
        navigate(redirectTo);
      }
    });
    
    return () => unsubscribe();
  }, [navigate, nextPath]);
  
  // Correct the next path if it's a full URL
  useEffect(() => {
    if (nextPath && nextPath.startsWith('https://')) {
      console.log('Found full URL in next parameter, correcting...');
      const url = new URL(nextPath);
      const pathname = url.pathname;
      
      // Redirect to the correct login page with the pathname only
      if (pathname !== window.location.pathname) {
        const newParams = new URLSearchParams();
        newParams.set('next', pathname);
        navigate(`/login?${newParams.toString()}`, { replace: true });
      }
    }
  }, [nextPath, navigate]);
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster />
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">M</div>
            <h1 className="text-xl font-bold">MoneyGate</h1>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-zinc-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to MoneyGate</h1>
            <p className="text-zinc-600">Sign in or create an account to discover your Hidden Money Doors</p>
          </div>
          
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-xs text-gray-500 mb-4">
              Current URL: {window.location.href}<br/>
              {nextPath ? `You'll be redirected to ${nextPath} after login` : ""}
            </p>
            <AuthForm />
          </div>
          
          <div className="mt-6 text-center text-sm text-zinc-500">
            By signing in, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </main>
    </div>
  );
};