import { create } from 'zustand';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { firebaseApp } from 'app';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(firebaseApp);

export interface KeywordSuggestion {
  keyword: string;
  search_volume: string;  // Now contains actual numeric values like "1,200"
  competition: 'Low' | 'Medium' | 'High';
  suggested_cpc: string;  // Contains dollar amounts like "$1.50"
}

export interface MonetizationIdea {
  idea: string;
  description: string;
  potential_value: string;  // Now contains actual dollar values like "$29 per month"
}

export interface ToolIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  status: 'idea' | 'inProgress' | 'completed';
  keywords: string[] | KeywordSuggestion[];
  monetizationIdeas: string[] | MonetizationIdea[];
  implementation_details?: string;
  embed_code?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ToolStore {
  tools: ToolIdea[];
  loading: boolean;
  error: Error | null;
  // Actions
  saveTool: (userId: string, tool: Omit<ToolIdea, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTool: (userId: string, toolId: string, updates: Partial<ToolIdea>) => Promise<void>;
  deleteTool: (userId: string, toolId: string) => Promise<void>;
  loadTools: (userId: string) => Promise<void>;
  loadToolsByCategory: (userId: string, category: ToolIdea['category']) => Promise<void>;
}

export const useToolStore = create<ToolStore>((set, get) => ({
  tools: [],
  loading: false,
  error: null,
  
  saveTool: async (userId: string, tool) => {
    try {
      set({ loading: true });
      const toolsCollection = collection(db, 'users', userId, 'tools');
      const newTool: ToolIdea = {
        ...tool,
        id: Math.random().toString(36).substr(2, 9), // Simple ID generation
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(toolsCollection, newTool.id), {
        ...newTool,
        createdAt: newTool.createdAt.toISOString(),
        updatedAt: newTool.updatedAt.toISOString()
      });
      
      set(state => ({
        tools: [...state.tools, newTool],
        loading: false
      }));
      
      return newTool.id;
    } catch (error) {
      console.error('Error saving tool:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  updateTool: async (userId: string, toolId: string, updates) => {
    try {
      set({ loading: true });
      const toolRef = doc(db, 'users', userId, 'tools', toolId);
      const updatedTool = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(toolRef, updatedTool, { merge: true });
      
      set(state => ({
        tools: state.tools.map(tool => 
          tool.id === toolId 
            ? { ...tool, ...updates, updatedAt: new Date() } 
            : tool
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating tool:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  deleteTool: async (userId: string, toolId: string) => {
    try {
      set({ loading: true });
      const toolRef = doc(db, 'users', userId, 'tools', toolId);
      await deleteDoc(toolRef);
      
      set(state => ({
        tools: state.tools.filter(tool => tool.id !== toolId),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting tool:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  loadTools: async (userId: string) => {
    try {
      set({ loading: true });
      const toolsCollection = collection(db, 'users', userId, 'tools');
      const querySnap = await getDocs(toolsCollection);
      
      const tools: ToolIdea[] = [];
      querySnap.forEach((doc) => {
        const data = doc.data();
        tools.push({
          ...data,
          id: doc.id,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        } as ToolIdea);
      });
      
      set({
        tools,
        loading: false
      });
    } catch (error) {
      console.error('Error loading tools:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  loadToolsByCategory: async (userId: string, category) => {
    try {
      set({ loading: true });
      const toolsCollection = collection(db, 'users', userId, 'tools');
      const q = query(
        toolsCollection,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnap = await getDocs(q);
      
      const tools: ToolIdea[] = [];
      querySnap.forEach((doc) => {
        const data = doc.data();
        tools.push({
          ...data,
          id: doc.id,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        } as ToolIdea);
      });
      
      set({
        tools,
        loading: false
      });
    } catch (error) {
      console.error('Error loading tools by category:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  }
}));