import React, { useEffect, useState } from "react";
import { firebaseAuth, firebaseApp } from "app";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { GoogleAuthProvider, signInWithPopup, browserLocalPersistence, setPersistence } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AuthDebug() {
  const [authState, setAuthState] = useState<string>("unknown");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [domainInfo, setDomainInfo] = useState<{
    currentDomain: string;
    currentOrigin: string;
    currentPath: string;
  }>({ currentDomain: "", currentOrigin: "", currentPath: "" });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Get domain information
    setDomainInfo({
      currentDomain: window.location.hostname,
      currentOrigin: window.location.origin,
      currentPath: window.location.pathname
    });

    // Check Firebase initialization
    if (!firebaseApp) {
      setError("Firebase app not initialized");
      setAuthState("error");
      return;
    }

    if (!firebaseAuth) {
      setError("Firebase auth not initialized");
      setAuthState("error");
      return;
    }

    // Setup auth state listener
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      (user) => {
        if (user) {
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
            emailVerified: user.emailVerified,
            providerData: user.providerData
          });
          setAuthState("authenticated");
        } else {
          setUser(null);
          setAuthState("unauthenticated");
        }
      },
      (err) => {
        console.error("Auth state error:", err);
        setError(`Auth state error: ${err.message}`);
        setAuthState("error");
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      setError(null);
      // First set persistence to LOCAL to ensure the user stays logged in
      try {
        await setPersistence(firebaseAuth, browserLocalPersistence);
        console.log('Set persistence to LOCAL');
      } catch (err) {
        console.error('Failed to set persistence:', err);
      }
      
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      // Add custom parameters to prevent init errors
      provider.setCustomParameters({
        'prompt': 'select_account'
      });
      
      await signInWithPopup(firebaseAuth, provider);
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(`Google sign-in error: ${err.code} - ${err.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseAuth.signOut();
    } catch (err: any) {
      console.error("Sign out error:", err);
      setError(`Sign out error: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Firebase Authentication Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Domain Information</CardTitle>
            <CardDescription>Information about the current domain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>Hostname:</strong> {domainInfo.currentDomain}
              </div>
              <div>
                <strong>Origin:</strong> {domainInfo.currentOrigin}
              </div>
              <div>
                <strong>Path:</strong> {domainInfo.currentPath}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current state of authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div>Status:</div>
              <Badge variant={authState === "authenticated" ? "success" : 
                     authState === "unauthenticated" ? "default" : 
                     "destructive"}>
                {authState}
              </Badge>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap break-words">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {authState === "authenticated" && user && (
              <div className="space-y-2 mt-4">
                <div><strong>User ID:</strong> {user.uid}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Name:</strong> {user.displayName || "Not set"}</div>
                <div><strong>Provider:</strong> {user.providerData[0]?.providerId || "Unknown"}</div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {authState === "authenticated" ? (
              <Button onClick={handleSignOut}>Sign Out</Button>
            ) : (
              <Button onClick={handleSignInWithGoogle}>Sign In with Google</Button>
            )}
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button variant="outline" onClick={() => navigate("/keyword-research")}>
              Test Protected Route
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Firebase Configuration</CardTitle>
          <CardDescription>Debug information about Firebase configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>Firebase App Available:</strong> {firebaseApp ? "Yes" : "No"}
            </div>
            <div>
              <strong>Firebase Auth Available:</strong> {firebaseAuth ? "Yes" : "No"}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Remember that your domain must be added to the authorized domains list in the Firebase console.
              For Firebase authentication to work, you need to add both your production domain and localhost.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
