import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app";
import { Button } from "components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/Card";
import { User, Settings, LogOut, Check, Loader2 } from "lucide-react";
import { getOrCreateUserProfile, updateUserProfile } from "utils/firestore";
import { toast } from "sonner";
import { useSubscriptionStore } from "utils/subscriptionStore";

interface ProfileData {
  displayName: string;
  email: string;
  photoURL: string | null;
  interests: string[];
}

export default function Profile() {
  const { user } = useUserGuardContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Subscription data
  const { 
    status: subscriptionStatus, 
    isLoading: isSubscriptionLoading, 
    fetchSubscriptionStatus,
    isSubscribed,
    getActivePlan
  } = useSubscriptionStore();
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL,
    interests: []
  });

  // Available interest options
  const availableInterests = [
    "Affiliate Marketing",
    "Content Creation",
    "Digital Products",
    "E-commerce",
    "Email Marketing",
    "Financial Tools",
    "Lead Generation",
    "SaaS",
    "Social Media Marketing"
  ];

  useEffect(() => {
    // Load subscription data
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user, fetchSubscriptionStatus]);

  useEffect(() => {
    // Load user profile data from Firestore
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const profile = await getOrCreateUserProfile(user);
        
        setProfileData({
          displayName: profile.displayName || user.displayName || "",
          email: profile.email || user.email || "",
          photoURL: profile.photoURL || user.photoURL,
          interests: profile.interests || []
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Update the user profile in Firestore
      const success = await updateUserProfile(user.uid, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
        interests: profileData.interests
      });
      
      if (success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div 
              onClick={() => navigate('/')} 
              className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer"
            >
              M
            </div>
            <h1 className="text-xl font-bold">MoneyGate</h1>
          </div>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li><a href="/dashboard" className="text-zinc-600 hover:text-blue-600 transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-zinc-600 hover:text-blue-600 transition-colors">Tools</a></li>
              <li>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/logout')}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {isLoading ? (
              <div className="flex items-center text-zinc-500">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Loading...
              </div>
            ) : !isEditing ? (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="flex items-center"
                disabled={isLoading}
              >
                <Settings className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <span className="ml-4 text-xl text-zinc-600">Loading profile data...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center">
                    <div className="mb-4 relative">
                      {profileData.photoURL ? (
                        <img 
                          src={profileData.photoURL} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover border-2 border-blue-600" 
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-12 w-12 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-1 text-center">
                      {profileData.displayName || "New User"}
                    </h3>
                    <p className="text-zinc-500 text-sm text-center mb-4">
                      {profileData.email || "No email set"}
                    </p>
                    <div className="w-full border-t pt-4">
                      <div className="flex flex-col space-y-2">
                        <a href="#" className="text-zinc-600 hover:text-blue-600 transition-colors py-1 px-2 rounded hover:bg-zinc-50">
                          Account Settings
                        </a>
                        <a href="/subscription" className="text-zinc-600 hover:text-blue-600 transition-colors py-1 px-2 rounded hover:bg-zinc-50">
                          Billing & Subscriptions
                        </a>
                        <a href="#" className="text-zinc-600 hover:text-blue-600 transition-colors py-1 px-2 rounded hover:bg-zinc-50">
                          Notifications
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-700 block mb-1">Display Name</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            name="displayName"
                            value={profileData.displayName} 
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                          />
                        ) : (
                          <div className="p-2 bg-zinc-50 rounded-md">{profileData.displayName || "Not set"}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-zinc-700 block mb-1">Email Address</label>
                        <div className="p-2 bg-zinc-50 rounded-md">{profileData.email || "Not set"}</div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-zinc-700 block mb-1">Interests</label>
                        <p className="text-sm text-zinc-500 mb-2">
                          Select topics you're interested in to personalize your experience
                        </p>
                        
                        {isEditing ? (
                          <div className="flex flex-wrap gap-2">
                            {availableInterests.map(interest => (
                              <button
                                key={interest}
                                type="button"
                                onClick={() => handleInterestToggle(interest)}
                                className={`px-3 py-1 text-sm rounded-full ${profileData.interests.includes(interest) 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'}`}
                              >
                                {interest}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {profileData.interests.length > 0 ? (
                              profileData.interests.map(interest => (
                                <span key={interest} className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                                  {interest}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-500 text-sm">No interests selected</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Manage your MoneyGate subscription</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Current Plan</h3>
                          {isSubscriptionLoading ? (
                            <p className="text-sm text-zinc-500 flex items-center">
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" /> Loading...
                            </p>
                          ) : (
                            <p className="text-sm text-zinc-500">
                              {getActivePlan()?.name || "Free plan"}
                              {isSubscribed() && subscriptionStatus?.is_trial && (
                                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                  Trial
                                </span>
                              )}
                              {isSubscribed() && subscriptionStatus?.subscription?.cancel_at_period_end && (
                                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                                  Canceling
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="primary"
                          onClick={() => navigate('/subscription')}
                          className="flex items-center"
                        >
                          Manage Subscription
                        </Button>
                      </div>
                      
                      {getActivePlan() && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-zinc-700 mb-1">Features</h4>
                          <ul className="text-sm text-zinc-600 space-y-1">
                            {getActivePlan().features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Manage your account's security settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-zinc-700">Password</label>
                          {!isEditing && (
                            <button className="text-sm text-blue-600 hover:underline">
                              Change Password
                            </button>
                          )}
                        </div>
                        {isEditing ? (
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            disabled
                            className="w-full p-2 border rounded-md"
                          />
                        ) : (
                          <div className="p-2 bg-zinc-50 rounded-md">••••••••</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-zinc-700 block mb-1">
                          Two-Factor Authentication
                        </label>
                        <div className="flex items-center justify-between p-2 bg-zinc-50 rounded-md">
                          <span>Not enabled</span>
                          {!isEditing && (
                            <button className="text-sm text-blue-600 hover:underline">
                              Enable
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}