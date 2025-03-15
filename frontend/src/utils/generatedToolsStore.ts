import { create } from 'zustand';
import { firebaseApp } from 'app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export type ToolFileType = 'spreadsheet' | 'document' | 'calculator';

export interface GeneratedTool {
  id: string;
  userId: string;
  title: string;
  description: string;
  fileType: ToolFileType;
  fileFormat: string; // 'xlsx', 'pdf', 'html', etc.
  fileSize: number;
  downloadUrl: string;
  storageRef: string;
  createdAt: Date;
  templateId?: string; // ID of the template used for generation
  customizationOptions?: Record<string, any>; // Store customization settings
}

export interface SpreadsheetOptions {
  title: string;
  description: string;
  targetAudience: string;
  complexity: string;
  includeBranding: boolean;
  includeResourceLinks: boolean;
  templateId: string;
  // Template-specific options
  columns?: string[];
  rows?: any[][];
  sheets?: Record<string, any>;
}

export interface DocumentOptions {
  title: string;
  description: string;
  targetAudience: string;
  complexity: string;
  includeBranding: boolean;
  includeResourceLinks: boolean;
  templateId: string;
  // Template-specific options
  content?: string;
  headerText?: string;
  footerText?: string;
  fontSize?: number;
}

interface GeneratedToolsState {
  tools: GeneratedTool[];
  loading: boolean;
  error: Error | null;
  // Actions
  generateSpreadsheet: (userId: string, options: SpreadsheetOptions) => Promise<GeneratedTool>;
  generateDocument: (userId: string, options: DocumentOptions) => Promise<GeneratedTool>;
  getUserTools: (userId: string) => Promise<GeneratedTool[]>;
  deleteGeneratedTool: (userId: string, toolId: string) => Promise<void>;
}

export const useGeneratedToolsStore = create<GeneratedToolsState>((set, get) => ({
  tools: [],
  loading: false,
  error: null,

  generateSpreadsheet: async (userId: string, options: SpreadsheetOptions) => {
    try {
      set({ loading: true });
      
      // Generate unique ID
      const toolId = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Generate spreadsheet based on template
      const workbook = await generateSpreadsheetFromTemplate(options);
      
      // Convert to binary data
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create storage reference
      const toolPath = `users/${userId}/tools/${toolId}.xlsx`;
      const storageReference = ref(storage, toolPath);
      
      // Upload to Firebase Storage
      await uploadBytes(storageReference, blob);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(storageReference);
      
      // Create metadata object
      const generatedTool: GeneratedTool = {
        id: toolId,
        userId,
        title: options.title,
        description: options.description,
        fileType: 'spreadsheet',
        fileFormat: 'xlsx',
        fileSize: blob.size,
        downloadUrl,
        storageRef: toolPath,
        createdAt: new Date(),
        templateId: options.templateId,
        customizationOptions: options
      };
      
      // Save metadata to Firestore
      const toolsCollection = collection(db, 'users', userId, 'generatedTools');
      await setDoc(doc(toolsCollection, toolId), {
        ...generatedTool,
        createdAt: generatedTool.createdAt.toISOString()
      });
      
      // Update local state
      set(state => ({
        tools: [...state.tools, generatedTool],
        loading: false
      }));
      
      return generatedTool;
    } catch (error) {
      console.error('Error generating spreadsheet:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  generateDocument: async (userId: string, options: DocumentOptions) => {
    try {
      set({ loading: true });
      
      // Generate unique ID
      const toolId = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Generate PDF based on template
      const pdfBlob = await generatePDFFromTemplate(options);
      
      // Create storage reference
      const toolPath = `users/${userId}/tools/${toolId}.pdf`;
      const storageReference = ref(storage, toolPath);
      
      // Upload to Firebase Storage
      await uploadBytes(storageReference, pdfBlob);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(storageReference);
      
      // Create metadata object
      const generatedTool: GeneratedTool = {
        id: toolId,
        userId,
        title: options.title,
        description: options.description,
        fileType: 'document',
        fileFormat: 'pdf',
        fileSize: pdfBlob.size,
        downloadUrl,
        storageRef: toolPath,
        createdAt: new Date(),
        templateId: options.templateId,
        customizationOptions: options
      };
      
      // Save metadata to Firestore
      const toolsCollection = collection(db, 'users', userId, 'generatedTools');
      await setDoc(doc(toolsCollection, toolId), {
        ...generatedTool,
        createdAt: generatedTool.createdAt.toISOString()
      });
      
      // Update local state
      set(state => ({
        tools: [...state.tools, generatedTool],
        loading: false
      }));
      
      return generatedTool;
    } catch (error) {
      console.error('Error generating document:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  getUserTools: async (userId: string) => {
    try {
      set({ loading: true });
      
      // Get tools from Firestore
      const toolsCollection = collection(db, 'users', userId, 'generatedTools');
      const q = query(toolsCollection, orderBy('createdAt', 'desc'));
      const querySnap = await getDocs(q);
      
      const tools: GeneratedTool[] = [];
      querySnap.forEach((doc) => {
        const data = doc.data();
        tools.push({
          ...data,
          id: doc.id,
          createdAt: new Date(data.createdAt),
        } as GeneratedTool);
      });
      
      // Update local state
      set({
        tools,
        loading: false
      });
      
      return tools;
    } catch (error) {
      console.error('Error loading generated tools:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  deleteGeneratedTool: async (userId: string, toolId: string) => {
    try {
      set({ loading: true });
      
      // Get tool metadata
      const toolRef = doc(db, 'users', userId, 'generatedTools', toolId);
      const toolSnap = await getDoc(toolRef);
      
      if (toolSnap.exists()) {
        const toolData = toolSnap.data() as GeneratedTool;
        
        // Delete from Storage
        const storageReference = ref(storage, toolData.storageRef);
        await deleteObject(storageReference);
        
        // Delete from Firestore
        await deleteDoc(toolRef);
        
        // Update local state
        set(state => ({
          tools: state.tools.filter(tool => tool.id !== toolId),
          loading: false
        }));
      } else {
        throw new Error('Tool not found');
      }
    } catch (error) {
      console.error('Error deleting generated tool:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  }
}));

// Helper functions for generating actual files

async function generateSpreadsheetFromTemplate(options: SpreadsheetOptions): Promise<XLSX.WorkBook> {
  const workbook = XLSX.utils.book_new();
  
  // Implementation based on template ID
  switch (options.templateId) {
    case 'savings-tracker': {
      // Create Savings Goal Tracker spreadsheet
      const worksheet = XLSX.utils.aoa_to_sheet([
        // Headers
        ['MoneyGate: Savings Goal Tracker', '', '', '', ''],
        ['', '', '', '', ''],
        ['Goal', 'Target Amount', 'Current Balance', 'Monthly Contribution', 'Target Date', 'Progress'],
        
        // Sample data
        ['Emergency Fund', '$10,000', '$2,500', '$500', '2023-12-31', '25%'],
        ['Home Down Payment', '$60,000', '$15,000', '$1,000', '2025-06-30', '25%'],
        ['Vacation', '$3,000', '$1,200', '$300', '2023-08-01', '40%'],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['Notes:', '', '', '', '', ''],
        ['- Set realistic monthly contribution amounts based on your budget', '', '', '', '', ''],
        ['- Consider automating your savings through recurring transfers', '', '', '', '', ''],
        ['- Review and adjust your goals quarterly', '', '', '', '', ''],
      ]);
      
      // Customize cell formats, formulas, and styling
      // In a real implementation, we would set up cell styles, formulas, etc.
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Savings Goals');
      
      // Add Instructions sheet if specified
      if (options.includeResourceLinks) {
        const instructionsSheet = XLSX.utils.aoa_to_sheet([
          ['Using Your Savings Goal Tracker'],
          [''],
          ['Getting Started:'],
          ['1. Replace the sample goals with your own savings targets'],
          ['2. Update the Current Balance with your actual savings'],
          ['3. Set realistic Monthly Contribution amounts'],
          ['4. Enter your Target Date for each goal'],
          [''],
          ['Tips:'],
          ['- The Progress column calculates automatically as you update your current balance'],
          ['- Consider high-yield savings accounts for better returns'],
          ['- Review your goals monthly and adjust as needed'],
          [''],
          ['Helpful Resources:'],
          ['- Visit www.moneygate.com for more financial tools'],
          ['- Consider speaking with a financial advisor for personalized advice']
        ]);
        
        XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');
      }
      
      break;
    }
    
    case 'budget-template': {
      // Create Monthly Budget spreadsheet
      const worksheet = XLSX.utils.aoa_to_sheet([
        ['MoneyGate: Monthly Budget Template', '', '', ''],
        ['', '', '', ''],
        ['INCOME', 'Budgeted', 'Actual', 'Difference'],
        ['Primary Job', '$0.00', '$0.00', '=$C3-$B3'],
        ['Secondary Income', '$0.00', '$0.00', '=$C4-$B4'],
        ['Other Income', '$0.00', '$0.00', '=$C5-$B5'],
        ['TOTAL INCOME', '=SUM(B3:B5)', '=SUM(C3:C5)', '=$C6-$B6'],
        ['', '', '', ''],
        ['EXPENSES', 'Budgeted', 'Actual', 'Difference'],
        ['Housing', '$0.00', '$0.00', '=$C9-$B9'],
        ['Utilities', '$0.00', '$0.00', '=$C10-$B10'],
        ['Food & Groceries', '$0.00', '$0.00', '=$C11-$B11'],
        ['Transportation', '$0.00', '$0.00', '=$C12-$B12'],
        ['Healthcare', '$0.00', '$0.00', '=$C13-$B13'],
        ['Debt Payments', '$0.00', '$0.00', '=$C14-$B14'],
        ['Savings & Investments', '$0.00', '$0.00', '=$C15-$B15'],
        ['Entertainment', '$0.00', '$0.00', '=$C16-$B16'],
        ['Personal', '$0.00', '$0.00', '=$C17-$B17'],
        ['Other', '$0.00', '$0.00', '=$C18-$B18'],
        ['TOTAL EXPENSES', '=SUM(B9:B18)', '=SUM(C9:C18)', '=$C19-$B19'],
        ['', '', '', ''],
        ['NET INCOME', '=B6-B19', '=C6-C19', '=$C21-$B21']
      ]);
      
      // Customize cell formats, formulas, and styling
      // In a real implementation, we would set up cell styles, formulas, etc.
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Budget');
      
      if (options.complexity === 'detailed' || options.complexity === 'comprehensive') {
        // Add Categories breakdown sheet for detailed budgets
        const categoriesSheet = XLSX.utils.aoa_to_sheet([
          ['Expense Categories Breakdown', '', ''],
          ['', '', ''],
          ['Housing', 'Actual', 'Notes'],
          ['Rent/Mortgage', '$0.00', ''],
          ['Property Tax', '$0.00', ''],
          ['Insurance', '$0.00', ''],
          ['Maintenance', '$0.00', ''],
          ['Total Housing', '=SUM(B3:B6)', ''],
          ['', '', ''],
          // Add more categories as needed
        ]);
        
        XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Categories');
      }
      
      break;
    }
    
    default: {
      // Generic spreadsheet
      const worksheet = XLSX.utils.aoa_to_sheet([
        [options.title, '', '', '', ''],
        [options.description, '', '', '', ''],
        ['', '', '', '', ''],
        // Add generic content
      ]);
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    }
  }
  
  // Return the generated workbook
  return workbook;
}

async function generatePDFFromTemplate(options: DocumentOptions): Promise<Blob> {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Document title
  doc.setFontSize(16);
  doc.text(options.title, 105, 20, { align: 'center' });
  
  // Implementation based on template ID
  switch (options.templateId) {
    case 'mortgage-letter': {
      // Create Mortgage Hardship Letter
      doc.setFontSize(12);
      doc.text('Your Name', 20, 40);
      doc.text('Your Address', 20, 45);
      doc.text('City, State ZIP', 20, 50);
      doc.text('Phone: (XXX) XXX-XXXX', 20, 55);
      doc.text('Email: your.email@example.com', 20, 60);
      doc.text('Date: ' + new Date().toLocaleDateString(), 20, 65);
      
      doc.text('[Lender Name]', 20, 80);
      doc.text('[Lender Address]', 20, 85);
      doc.text('[City, State ZIP]', 20, 90);
      
      doc.text('Re: Mortgage Hardship Request - [Loan Number]', 20, 105);
      
      doc.text('Dear [Lender Name],', 20, 120);
      
      let content = 'I am writing to request assistance regarding my mortgage loan. Due to unforeseen financial circumstances, ' +
        'I am experiencing difficulty meeting my monthly mortgage payment obligations. ' +
        'I value my home and have always prioritized making my mortgage payments on time. ' +
        'However, I am currently facing a temporary financial hardship due to [your specific hardship reason].\n\n' +
        'This situation has significantly impacted my income and my ability to meet my financial obligations. ' +
        'I am requesting consideration for a [forbearance plan/loan modification/other specific request] ' +
        'that would allow me to maintain my home while I work through these temporary financial challenges.\n\n' +
        'I have taken the following steps to address my financial situation:\n' +
        '• [Action taken - e.g., reduced unnecessary expenses]\n' +
        '• [Action taken - e.g., sought additional income]\n' +
        '• [Action taken - e.g., consulted financial counselor]\n\n' +
        'I am committed to fulfilling my mortgage obligation and maintaining my home. ' +
        'I believe that with temporary assistance, I will be able to resume regular payments by [estimated date].\n\n' +
        'Thank you for considering my request. I am open to discussing any solutions that would help me keep my home ' +
        'while resolving this temporary hardship. Please contact me at [phone] or [email] if you need additional information.\n\n' +
        'Sincerely,\n\n\n' +
        '[Your Name]';
      
      // Split long text into multiple lines
      const contentLines = doc.splitTextToSize(content, 170);
      doc.text(contentLines, 20, 130);
      
      break;
    }
    
    default: {
      // Generic document
      doc.setFontSize(12);
      doc.text(options.description, 20, 40);
      
      // Add generic content
      let content = 'This is a template document generated by MoneyGate. ' +
        'You can customize this content with your specific information. ' +
        'Add your details and personalize this document to suit your needs.\n\n' +
        'For more templates and financial tools, visit www.moneygate.com';
      
      // Split long text into multiple lines
      const contentLines = doc.splitTextToSize(content, 170);
      doc.text(contentLines, 20, 60);
    }
  }
  
  // Add branding if specified
  if (options.includeBranding) {
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100); // Grey color
    doc.text('Generated by MoneyGate | www.moneygate.com', 105, 285, { align: 'center' });
  }
  
  // Add resources if specified
  if (options.includeResourceLinks) {
    doc.setFontSize(8);
    doc.text('Additional Resources:', 20, 270);
    doc.text('• Visit www.moneygate.com for more financial tools', 20, 275);
    doc.text('• Consumer Financial Protection Bureau: www.consumerfinance.gov', 20, 280);
  }
  
  // Convert to blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
}
