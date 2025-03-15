import { firebaseApp } from "app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

// User profile interface
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  interests: string[];
  createdAt?: number;
  updatedAt: number;
}

/**
 * Get a user's profile from Firestore
 * @param uid User ID
 * @returns The user profile or null if not found
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(firestore, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

/**
 * Create a new user profile in Firestore
 * @param profile User profile data
 * @returns True if successful, false otherwise
 */
export const createUserProfile = async (profile: UserProfile): Promise<boolean> => {
  try {
    const userRef = doc(firestore, "users", profile.uid);
    const now = Date.now();
    
    await setDoc(userRef, {
      ...profile,
      createdAt: now,
      updatedAt: now
    });
    
    return true;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return false;
  }
};

/**
 * Update a user's profile in Firestore
 * @param uid User ID
 * @param data Partial profile data to update
 * @returns True if successful, false otherwise
 */
export const updateUserProfile = async (
  uid: string, 
  data: Partial<Omit<UserProfile, "uid" | "createdAt">>
): Promise<boolean> => {
  try {
    const userRef = doc(firestore, "users", uid);
    
    await updateDoc(userRef, {
      ...data,
      updatedAt: Date.now()
    });
    
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

/**
 * Get or create a user profile
 * @param user Firebase auth user
 * @returns The user profile
 */
export const getOrCreateUserProfile = async (user: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}): Promise<UserProfile> => {
  const existingProfile = await getUserProfile(user.uid);
  
  if (existingProfile) {
    return existingProfile;
  }
  
  // Create a new profile
  const newProfile: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL,
    interests: [],
    updatedAt: Date.now()
  };
  
  await createUserProfile(newProfile);
  return newProfile;
};
