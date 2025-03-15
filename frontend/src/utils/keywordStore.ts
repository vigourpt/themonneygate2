import { create } from 'zustand';
import brain from 'brain';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { firebaseApp } from 'app';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(firebaseApp);

export interface KeywordMetrics {
  keyword: string;
  searchVolume: number;
  competition: 'Low' | 'Medium' | 'High';
  cpc: number;
  category: 'tool' | 'monetization';
  difficulty?: number; // 0-100 scale
  trafficPotential?: number;
}

export interface KeywordAnalysisResult {
  id: string;
  name: string;
  description?: string;
  dateCreated: Date;
  lastUpdated: Date;
  seedKeyword: string;
  toolKeywords: KeywordMetrics[];
  monetizationKeywords: KeywordMetrics[];
  notes?: string;
  tags?: string[];
}

export interface KeywordSearchParams {
  seedKeyword: string;
  toolCategory?: string;
  monetizationNiche?: string;
}

interface KeywordStore {
  analyses: KeywordAnalysisResult[];
  currentAnalysis: KeywordAnalysisResult | null;
  loading: boolean;
  error: Error | null;
  // Actions
  search: (params: KeywordSearchParams) => Promise<KeywordAnalysisResult>;
  saveAnalysis: (userId: string, analysis: Omit<KeywordAnalysisResult, 'id' | 'dateCreated' | 'lastUpdated'>) => Promise<string>;
  updateAnalysis: (userId: string, analysisId: string, updates: Partial<KeywordAnalysisResult>) => Promise<void>;
  deleteAnalysis: (userId: string, analysisId: string) => Promise<void>;
  loadAnalyses: (userId: string) => Promise<void>;
  getAnalysisById: (userId: string, analysisId: string) => Promise<KeywordAnalysisResult | null>;
}

export const useKeywordStore = create<KeywordStore>((set, get) => ({
  analyses: [],
  currentAnalysis: null,
  loading: false,
  error: null,
  
  search: async (params) => {
    try {
      set({ loading: true });
      
      // Use the real API endpoint to get keyword data
      const result = await fetchKeywords(params);
      
      set({
        currentAnalysis: result,
        loading: false
      });
      
      return result;
    } catch (error) {
      console.error('Error searching keywords:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  saveAnalysis: async (userId: string, analysis) => {
    try {
      set({ loading: true });
      const analysesCollection = collection(db, 'users', userId, 'keywordAnalyses');
      const newAnalysis: KeywordAnalysisResult = {
        ...analysis,
        id: Math.random().toString(36).substr(2, 9), // Simple ID generation
        dateCreated: new Date(),
        lastUpdated: new Date()
      };
      
      await setDoc(doc(analysesCollection, newAnalysis.id), {
        ...newAnalysis,
        dateCreated: newAnalysis.dateCreated.toISOString(),
        lastUpdated: newAnalysis.lastUpdated.toISOString()
      });
      
      set(state => ({
        analyses: [...state.analyses, newAnalysis],
        loading: false
      }));
      
      return newAnalysis.id;
    } catch (error) {
      console.error('Error saving analysis:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  updateAnalysis: async (userId: string, analysisId: string, updates) => {
    try {
      set({ loading: true });
      const analysisRef = doc(db, 'users', userId, 'keywordAnalyses', analysisId);
      const updatedAnalysis = {
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      await setDoc(analysisRef, updatedAnalysis, { merge: true });
      
      set(state => ({
        analyses: state.analyses.map(analysis => 
          analysis.id === analysisId 
            ? { ...analysis, ...updates, lastUpdated: new Date() } 
            : analysis
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating analysis:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  deleteAnalysis: async (userId: string, analysisId: string) => {
    try {
      set({ loading: true });
      const analysisRef = doc(db, 'users', userId, 'keywordAnalyses', analysisId);
      await deleteDoc(analysisRef);
      
      set(state => ({
        analyses: state.analyses.filter(analysis => analysis.id !== analysisId),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting analysis:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  loadAnalyses: async (userId: string) => {
    try {
      set({ loading: true });
      const analysesCollection = collection(db, 'users', userId, 'keywordAnalyses');
      const querySnap = await getDocs(query(analysesCollection, orderBy('lastUpdated', 'desc')));
      
      const analyses: KeywordAnalysisResult[] = [];
      querySnap.forEach((doc) => {
        const data = doc.data();
        analyses.push({
          ...data,
          id: doc.id,
          dateCreated: new Date(data.dateCreated),
          lastUpdated: new Date(data.lastUpdated)
        } as KeywordAnalysisResult);
      });
      
      set({
        analyses,
        loading: false
      });
    } catch (error) {
      console.error('Error loading analyses:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  getAnalysisById: async (userId: string, analysisId: string) => {
    try {
      set({ loading: true });
      const analysisRef = doc(db, 'users', userId, 'keywordAnalyses', analysisId);
      const docSnap = await getDoc(analysisRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const analysis = {
          ...data,
          id: docSnap.id,
          dateCreated: new Date(data.dateCreated),
          lastUpdated: new Date(data.lastUpdated)
        } as KeywordAnalysisResult;
        
        set({ loading: false });
        return analysis;
      }
      
      set({ loading: false });
      return null;
    } catch (error) {
      console.error('Error getting analysis:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  }
}));

// Real API call for keyword search
const fetchKeywords = async (params: KeywordSearchParams): Promise<KeywordAnalysisResult> => {
  try {
    // Try the main fixed API endpoint first
    try {
      // Use the fixed API endpoint for keyword analysis
      const response = await brain.analyze_keywords_original_endpoint({
        seed_keyword: params.seedKeyword.trim(),
        limit: 10
      });
      
      const apiResult = await response.json();
      
      // Map API response to our store format
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: `Analysis for "${params.seedKeyword}"`,
        dateCreated: new Date(),
        lastUpdated: new Date(),
        seedKeyword: params.seedKeyword,
        toolKeywords: apiResult.tool_keywords.map((kw: any) => ({
          keyword: kw.keyword,
          searchVolume: kw.search_volume,
          competition: kw.competition as 'Low' | 'Medium' | 'High',
          cpc: kw.cpc,
          category: 'tool',
          difficulty: kw.difficulty || Math.floor(Math.random() * 30) + 10,
          trafficPotential: kw.traffic_potential || Math.floor(kw.search_volume * 0.1)
        })),
        monetizationKeywords: apiResult.monetization_keywords.map((kw: any) => ({
          keyword: kw.keyword,
          searchVolume: kw.search_volume,
          competition: kw.competition as 'Low' | 'Medium' | 'High',
          cpc: kw.cpc,
          category: 'monetization',
          difficulty: kw.difficulty || Math.floor(Math.random() * 20) + 70,
          trafficPotential: kw.traffic_potential || Math.floor(kw.search_volume * 0.05)
        })),
        tags: apiResult.tags || []
      };
    } catch (primaryErr) {
      console.warn("Primary API failed, trying fallback:", primaryErr);
      
      // Try the fallback API if main one fails
      const fallbackResponse = await brain.analyze_keywords_fallback_original_endpoint({
        seed_keyword: params.seedKeyword.trim(),
        limit: 10
      });
      
      const fallbackResult = await fallbackResponse.json();
      
      // Map API response to our store format
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: `Analysis for "${params.seedKeyword}"`,
        dateCreated: new Date(),
        lastUpdated: new Date(),
        seedKeyword: params.seedKeyword,
        toolKeywords: fallbackResult.tool_keywords.map((kw: any) => ({
          keyword: kw.keyword,
          searchVolume: kw.search_volume,
          competition: kw.competition as 'Low' | 'Medium' | 'High',
          cpc: kw.cpc,
          category: 'tool',
          difficulty: kw.difficulty || Math.floor(Math.random() * 30) + 10,
          trafficPotential: kw.traffic_potential || Math.floor(kw.search_volume * 0.1)
        })),
        monetizationKeywords: fallbackResult.monetization_keywords.map((kw: any) => ({
          keyword: kw.keyword,
          searchVolume: kw.search_volume,
          competition: kw.competition as 'Low' | 'Medium' | 'High',
          cpc: kw.cpc,
          category: 'monetization',
          difficulty: kw.difficulty || Math.floor(Math.random() * 20) + 70,
          trafficPotential: kw.traffic_potential || Math.floor(kw.search_volume * 0.05)
        })),
        tags: fallbackResult.tags || []
      };
    }
  } catch (err) {
    console.error("Both API endpoints failed:", err);
    throw err;
  }
};
