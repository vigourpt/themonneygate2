import { create } from 'zustand';
import { firebaseApp } from 'app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

const db = getFirestore(firebaseApp);

export type MonetizationMethod = "affiliate" | "ads" | "upsell" | "membership";

export interface AffiliateProgram {
  id: string;
  name: string;
  category: string;
  commission: string;
  url: string;
  conversionRate: string;
}

export interface MonetizationStrategy {
  id: string;
  toolId: string;
  userId: string;
  selectedMethod: MonetizationMethod;
  selectedAffiliates?: string[];
  adsSettings?: Record<string, any>;
  upsellSettings?: Record<string, any>;
  membershipSettings?: Record<string, any>;
  implemented: boolean;
  implementationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MonetizationState {
  strategies: MonetizationStrategy[];
  loading: boolean;
  error: Error | null;
  // Actions
  getToolStrategies: (userId: string, toolId: string) => Promise<MonetizationStrategy[]>;
  saveStrategy: (userId: string, strategy: Omit<MonetizationStrategy, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateImplementationStatus: (userId: string, strategyId: string, implemented: boolean, notes?: string) => Promise<void>;
  getRecommendedAffiliates: (toolType: string, toolCategory?: string) => AffiliateProgram[];
}

export const affiliatePrograms: AffiliateProgram[] = [
  {
    id: "capital-one",
    name: "Capital One",
    category: "Banking & Credit Cards",
    commission: "$100-200 per approved account",
    url: "https://www.capitalone.com/affiliates/",
    conversionRate: "3-5%"
  },
  {
    id: "betterment",
    name: "Betterment",
    category: "Wealth Management",
    commission: "Up to $1,000 per referral",
    url: "https://www.betterment.com/affiliate-program",
    conversionRate: "1-3%"
  },
  {
    id: "credible",
    name: "Credible",
    category: "Loan Comparison",
    commission: "$25-200 per lead",
    url: "https://www.credible.com/partners",
    conversionRate: "4-7%"
  },
  {
    id: "lending-club",
    name: "LendingClub",
    category: "Personal Loans",
    commission: "$50-150 per funded loan",
    url: "https://www.lendingclub.com/affiliates",
    conversionRate: "2-4%"
  },
  {
    id: "robinhood",
    name: "Robinhood",
    category: "Investment",
    commission: "$50 per new account",
    url: "https://robinhood.com/affiliates",
    conversionRate: "5-8%"
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "Accounting Software",
    commission: "15-20% of subscription",
    url: "https://quickbooks.intuit.com/affiliates/",
    conversionRate: "3-6%"
  },
  {
    id: "personal-capital",
    name: "Personal Capital",
    category: "Financial Planning",
    commission: "$100 per qualifying lead",
    url: "https://www.personalcapital.com/affsignup/",
    conversionRate: "2-4%"
  },
  {
    id: "credit-karma",
    name: "Credit Karma",
    category: "Credit Monitoring",
    commission: "$10-25 per approved member",
    url: "https://www.creditkarma.com/about/partner",
    conversionRate: "8-12%"
  },
  {
    id: "mint",
    name: "Mint",
    category: "Budgeting Tools",
    commission: "$5-20 per account",
    url: "https://www.mint.com/",
    conversionRate: "5-8%"
  },
  {
    id: "sofi",
    name: "SoFi",
    category: "Student Loan Refinancing",
    commission: "$100-400 per funded loan",
    url: "https://www.sofi.com/affiliate-program/",
    conversionRate: "3-6%"
  },
  {
    id: "acorns",
    name: "Acorns",
    category: "Micro-Investing",
    commission: "$5-20 per new account",
    url: "https://www.acorns.com/affiliates/",
    conversionRate: "6-10%"
  },
  {
    id: "credit-sesame",
    name: "Credit Sesame",
    category: "Credit Monitoring",
    commission: "$10-20 per member",
    url: "https://www.creditsesame.com/",
    conversionRate: "6-9%"
  }
];

// Map of tool types and categories to recommended affiliate programs
const affiliateRecommendations: Record<string, Record<string, string[]>> = {
  spreadsheet: {
    savings: ["capital-one", "betterment", "mint", "acorns"],
    budget: ["mint", "personal-capital", "quickbooks"],
    debt: ["credible", "lending-club", "sofi", "credit-karma"],
    investment: ["robinhood", "betterment", "acorns", "personal-capital"],
    default: ["capital-one", "mint", "credit-karma"]
  },
  document: {
    mortgage: ["credible", "lending-club", "sofi"],
    tax: ["quickbooks", "credit-karma"],
    legal: ["lending-club", "credit-sesame"],
    default: ["credit-karma", "personal-capital"]
  },
  calculator: {
    loan: ["credible", "lending-club", "sofi"],
    investment: ["robinhood", "betterment", "personal-capital"],
    retirement: ["betterment", "personal-capital", "capital-one"],
    default: ["mint", "personal-capital"]
  },
  default: {
    default: ["capital-one", "credit-karma", "personal-capital", "mint"]
  }
};

export const useMonetizationStore = create<MonetizationState>((set, get) => ({
  strategies: [],
  loading: false,
  error: null,

  getToolStrategies: async (userId: string, toolId: string) => {
    try {
      set({ loading: true });
      
      const strategiesCollection = collection(db, 'users', userId, 'monetizationStrategies');
      const q = query(
        strategiesCollection,
        where('toolId', '==', toolId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnap = await getDocs(q);
      
      const strategies: MonetizationStrategy[] = [];
      querySnap.forEach((doc) => {
        const data = doc.data();
        strategies.push({
          ...data,
          id: doc.id,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        } as MonetizationStrategy);
      });
      
      set({
        strategies,
        loading: false,
      });
      
      return strategies;
    } catch (error) {
      console.error('Error loading monetization strategies:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  saveStrategy: async (userId: string, strategy) => {
    try {
      set({ loading: true });
      
      // Generate unique ID if not provided
      const strategyId = strategy.id || `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Create the full strategy object
      const fullStrategy: MonetizationStrategy = {
        ...strategy,
        id: strategyId,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Save to Firestore
      const strategiesCollection = collection(db, 'users', userId, 'monetizationStrategies');
      await setDoc(doc(strategiesCollection, strategyId), {
        ...fullStrategy,
        createdAt: fullStrategy.createdAt.toISOString(),
        updatedAt: fullStrategy.updatedAt.toISOString(),
      });
      
      // Update local state
      set(state => ({
        strategies: [...state.strategies, fullStrategy],
        loading: false,
      }));
      
      return strategyId;
    } catch (error) {
      console.error('Error saving monetization strategy:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  updateImplementationStatus: async (userId: string, strategyId: string, implemented: boolean, notes?: string) => {
    try {
      set({ loading: true });
      
      // Update in Firestore
      const strategyRef = doc(db, 'users', userId, 'monetizationStrategies', strategyId);
      const updateData: Record<string, any> = {
        implemented,
        updatedAt: new Date().toISOString(),
      };
      
      if (notes !== undefined) {
        updateData.implementationNotes = notes;
      }
      
      await setDoc(strategyRef, updateData, { merge: true });
      
      // Update local state
      set(state => ({
        strategies: state.strategies.map(s => 
          s.id === strategyId 
            ? { ...s, implemented, implementationNotes: notes ?? s.implementationNotes, updatedAt: new Date() } 
            : s
        ),
        loading: false,
      }));
    } catch (error) {
      console.error('Error updating implementation status:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  getRecommendedAffiliates: (toolType, toolCategory) => {
    const fileType = toolType || 'default';
    const category = toolCategory || 'default';
    
    // Get recommendations based on file type and category
    const recommendationsForType = affiliateRecommendations[fileType] || affiliateRecommendations.default;
    const recommendedIds = recommendationsForType[category] || recommendationsForType.default;
    
    // Return the full affiliate objects for the recommended IDs
    return affiliatePrograms.filter(program => recommendedIds.includes(program.id));
  }
}));
