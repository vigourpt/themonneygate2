import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { firebaseAuth } from "app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";
import { firebaseApp } from "app";
import { Button } from "components/Button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, AlertCircle } from "lucide-react";

enum AuthMode {
  SIGN_IN = "sign_in",
  SIGN_UP = "sign_up",
  RESET_PASSWORD = "reset_password"
}

export const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get("next");
  const [mode, setMode] = useState<AuthMode>(AuthMode.SIGN_IN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const db = getFirestore(firebaseApp);

  // Check if we need to redirect after successful auth
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user && nextPath) {
        console.log(`User authenticated, redirecting to: ${nextPath}`);
        navigate(nextPath);
      }
    });
    
    return () => unsubscribe();
  }, [navigate, nextPath]);

  const signInWithGoogle = async () => {
    // Log to help debug authentication issues
    console.log('Attempting Google sign-in');
    console.log('Next path after login:', nextPath);
    try {
      setIsLoading(true);
      setError(null);
      
      // Log Firebase Auth instance and domain to debug
      console.log('Firebase Auth available:', !!firebaseAuth);
      console.log('Current domain:', window.location.hostname);
      console.log('Current origin:', window.location.origin);
      console.log('Authorized domains (check Firebase console):', 'databutton.com', window.location.hostname);
      
      // Try to use popup first (works better in development) and fallback to redirect
      // First set persistence to LOCAL to ensure the user stays logged in
      try {
        await setPersistence(firebaseAuth, browserLocalPersistence);
        console.log('Set persistence to LOCAL');
      } catch (err) {
        console.error('Failed to set persistence:', err);
      }
      
      // Configure provider
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.setCustomParameters({
        'prompt': 'select_account'
      });
      
      // Store the intended redirect path in localStorage for both redirect and popup methods
      if (nextPath) {
        localStorage.setItem('authRedirectPath', nextPath);
        console.log('Stored redirect path in localStorage:', nextPath);
      }
      
      try {
        // Try popup first (better UX in most cases)
        console.log('Attempting sign in with popup...');
        const result = await signInWithPopup(firebaseAuth, provider);
        console.log('Sign in with popup successful');
        
        // Handle successful auth
        if (result.user) {
          // Check if the user is an admin
          const isAdmin = result.user.email === "vigourpt@googlemail.com";
          if (isAdmin) {
            localStorage.setItem("isAdmin", "true");
          }
          
          try {
            // Save user data if possible
            await setDoc(doc(db, "users", result.user.uid), {
              email: result.user.email,
              displayName: result.user.displayName || name,
              photoURL: result.user.photoURL,
              lastLoginAt: Timestamp.now()
            }, { merge: true });
          } catch (firestoreErr) {
            console.error('Failed to save user data to Firestore:', firestoreErr);
            // Non-blocking error - continue even if Firestore update fails
          }
        }
      } catch (popupErr: any) {
        console.warn('Popup authentication failed, trying redirect method...', popupErr);
        
        if (popupErr.code === "auth/popup-blocked" || popupErr.code === "auth/popup-closed-by-user") {
          // If popup is blocked or closed, try redirect method
          console.log('Using redirect method as fallback...');
          await signInWithRedirect(firebaseAuth, provider);
          return; // Page will redirect, no need to continue
        } else if (popupErr.code === "auth/unauthorized-domain") {
          throw popupErr; // Re-throw domain errors as they'll affect redirect too
        } else {
          // For other errors, try redirect method
          await signInWithRedirect(firebaseAuth, provider);
          return; // Page will redirect
        }
      }
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      
      // Handle domain-related errors (common in production)
      if (err.code === "auth/unauthorized-domain") {
        setError(`This domain (${window.location.hostname}) is not authorized for Firebase authentication. Authorized domains should include databutton.com and your app domain.`);
        console.error(`Domain authorization error. Add these domains to Firebase console: ${window.location.hostname}, databutton.com, themoneygate.com, www.themoneygate.com`);
        
        // Add helpful debugging info for fixing the issue
        console.log('Firebase Authorization Issue: To fix this, go to the Firebase Console:');
        console.log('1. Navigate to Authentication > Settings > Authorized domains');
        console.log(`2. Add the following domains if they're not already there:`);
        console.log(`   - ${window.location.hostname}`);
        console.log('   - databutton.com');
        console.log('   - themoneygate.com');
        console.log('   - www.themoneygate.com');
        
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Authentication popup was closed. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Authentication popup was blocked. Please allow popups for this site and try again.");
      } else {
        setError(`Failed to sign in with Google (${err.code}). Please try again.`);
        console.error('Full error object:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    console.log('Attempting email sign-in');
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      
      // Update last login time
      if (result.user) {
        await setDoc(doc(db, "users", result.user.uid), {
          lastLoginAt: Timestamp.now()
        }, { merge: true });
      }
    } catch (err: any) {
      console.error("Email sign-in error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    console.log('Attempting email sign-up');
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    if (!name) {
      setError("Please enter your name");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      
      // Save user info to Firestore
      if (result.user) {
        // Check if the user is an admin (vigourpt@googlemail.com)
        const isAdmin = email === "vigourpt@googlemail.com";
        
        // Update profile
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          displayName: name,
          createdAt: Timestamp.now(),
          lastLoginAt: Timestamp.now()
        });
        
        // If admin, add to admins collection
        if (isAdmin) {
          await setDoc(doc(db, "admins", result.user.uid), {
            email: result.user.email,
            addedAt: Timestamp.now()
          });
        }
      }
      
      toast.success("Account created successfully!");
    } catch (err: any) {
      console.error("Email sign-up error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Please sign in instead.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await firebaseAuth.sendPasswordResetEmail(email);
      toast.success("Password reset email sent! Check your inbox.");
      setMode(AuthMode.SIGN_IN);
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === AuthMode.SIGN_IN) {
      handleEmailSignIn();
    } else if (mode === AuthMode.SIGN_UP) {
      handleEmailSignUp();
    } else if (mode === AuthMode.RESET_PASSWORD) {
      resetPassword();
    }
  };

  return (
    <div className="w-full">
      {/* Mode Selector */}
      {mode !== AuthMode.RESET_PASSWORD && (
        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-2 text-center font-medium ${mode === AuthMode.SIGN_IN ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => {
              setMode(AuthMode.SIGN_IN);
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${mode === AuthMode.SIGN_UP ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => {
              setMode(AuthMode.SIGN_UP);
              setError(null);
            }}
          >
            Create Account
          </button>
        </div>
      )}

      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">
        {mode === AuthMode.SIGN_IN && "Sign in with email"}
        {mode === AuthMode.SIGN_UP && "Create your account"}
        {mode === AuthMode.RESET_PASSWORD && "Reset your password"}
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="text-red-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Name Field (Sign Up only) */}
          {mode === AuthMode.SIGN_UP && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={isLoading}
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* Password Field (not for Reset Password) */}
          {mode !== AuthMode.RESET_PASSWORD && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {mode === AuthMode.SIGN_IN && (
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setMode(AuthMode.RESET_PASSWORD);
                      setError(null);
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === AuthMode.SIGN_UP ? "Create a password" : "Enter your password"}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                {mode === AuthMode.SIGN_IN && "Sign In"}
                {mode === AuthMode.SIGN_UP && "Create Account"}
                {mode === AuthMode.RESET_PASSWORD && "Reset Password"}
              </>
            )}
          </Button>

          {/* Back Button (Reset Password only) */}
          {mode === AuthMode.RESET_PASSWORD && (
            <button
              type="button"
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 text-center w-full"
              onClick={() => {
                setMode(AuthMode.SIGN_IN);
                setError(null);
              }}
            >
              Back to sign in
            </button>
          )}

          {/* Google Sign In */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={signInWithGoogle}
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>
      </form>
    </div>
  );
};
