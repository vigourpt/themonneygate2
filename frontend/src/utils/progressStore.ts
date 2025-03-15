import { create } from 'zustand';
import { collection, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { firebaseApp } from 'app';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(firebaseApp);

export interface UserProgress {
  currentStep: number;
  completedSteps: number[];
  currentlyWorking: number;
  lastUpdated: Date;
}

interface ProgressStore {
  progress: UserProgress;
  loading: boolean;
  error: Error | null;
  // Actions
  setCurrentStep: (step: number) => void;
  completeStep: (step: number) => void;
  saveProgress: (userId: string) => Promise<void>;
  loadProgress: (userId: string) => Promise<void>;
  subscribeToProgress: (userId: string) => () => void;
}

const defaultProgress: UserProgress = {
  currentStep: 1,
  completedSteps: [],
  currentlyWorking: 1,
  lastUpdated: new Date()
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: { ...defaultProgress },
  loading: false,
  error: null,
  
  setCurrentStep: (step: number) => {
    set(state => ({
      progress: {
        ...state.progress,
        currentStep: step,
        lastUpdated: new Date()
      }
    }));
  },
  
  setCurrentlyWorking: (step: number) => {
    set(state => ({
      progress: {
        ...state.progress,
        currentlyWorking: step,
        lastUpdated: new Date()
      }
    }));
  },
  
  completeStep: (step: number) => {
    set(state => {
      const completedSteps = state.progress.completedSteps.includes(step)
        ? state.progress.completedSteps
        : [...state.progress.completedSteps, step];
      
      // Automatically move to next step if not already there
      const nextStep = state.progress.currentStep > step 
        ? state.progress.currentStep 
        : step + 1;
        
      return {
        progress: {
          ...state.progress,
          completedSteps,
          currentStep: nextStep,
          currentlyWorking: nextStep,
          lastUpdated: new Date()
        }
      };
    });
  },
  
  saveProgress: async (userId: string) => {
    try {
      const progressRef = doc(db, 'userProgress', userId);
      await setDoc(progressRef, {
        ...get().progress,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      set({ error: error as Error });
    }
  },
  
  loadProgress: async (userId: string) => {
    set({ loading: true });
    try {
      const progressRef = doc(db, 'userProgress', userId);
      const docSnap = await getDoc(progressRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          progress: {
            currentStep: data.currentStep,
            completedSteps: data.completedSteps,
            lastUpdated: new Date(data.lastUpdated)
          },
          loading: false
        });
      } else {
        // No data exists yet, initialize with defaults
        set({
          progress: { ...defaultProgress },
          loading: false
        });
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      set({
        error: error as Error,
        loading: false
      });
    }
  },
  
  subscribeToProgress: (userId: string) => {
    const progressRef = doc(db, 'userProgress', userId);
    
    const unsubscribe = onSnapshot(progressRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          progress: {
            currentStep: data.currentStep,
            completedSteps: data.completedSteps,
            lastUpdated: new Date(data.lastUpdated)
          },
          loading: false
        });
      }
    }, (error) => {
      console.error('Error subscribing to progress:', error);
      set({
        error: error as Error,
        loading: false
      });
    });
    
    return unsubscribe;
  }
}));
