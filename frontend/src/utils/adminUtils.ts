import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "app";

/**
 * Check if a user is an admin by checking if they exist in the admins collection
 */
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const db = getFirestore(firebaseApp);
    const adminRef = doc(db, "admins", userId);
    const adminDoc = await getDoc(adminRef);
    
    return adminDoc.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
