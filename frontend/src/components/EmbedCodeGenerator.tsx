import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { GeneratedTool } from 'utils/generatedToolsStore';
import { Button } from 'components/Button';

interface Props {
  tool: GeneratedTool;
}

export function EmbedCodeGenerator({ tool }: Props) {
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [embedOptions, setEmbedOptions] = useState({
    width: '100%',
    height: '500px',
    showBranding: true,
  });

  // Generate IFrame embed code
  const getEmbedCode = () => {
    const brandingParam = embedOptions.showBranding ? '&branding=true' : '';
    
    // Use a relative path to make it work on any domain
    // This ensures it works on both development and production domains
    // For spreadsheets, we'll create a dynamic viewer
    if (tool.fileType === 'spreadsheet') {
      return `<iframe 
  src="${window.location.origin}/embed-tool?id=${tool.id}&type=${tool.fileType}&userId=${tool.userId}${brandingParam}" 
  width="${embedOptions.width}" 
  height="${embedOptions.height}" 
  frameborder="0" 
  allowtransparency="true"
  allow="encrypted-media">
</iframe>`;
    }
    
    // For PDFs we can use the download URL directly
    if (tool.fileType === 'document' && tool.fileFormat === 'pdf') {
      return `<iframe 
  src="${tool.downloadUrl}" 
  width="${embedOptions.width}" 
  height="${embedOptions.height}" 
  frameborder="0" 
  allowtransparency="true">
</iframe>`;
    }
    
    // Default link for other types
    return `<a href="${tool.downloadUrl}" target="_blank" rel="noopener noreferrer">
  Download ${tool.title} - Powered by TheMoneyGate (themoneygate.com)
</a>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEmbedOptions({
        ...embedOptions,
        [name]: checked
      });
    } else {
      setEmbedOptions({
        ...embedOptions,
        [name]: value
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-zinc-50">
      <h3 className="text-base font-medium mb-3">Embed This Tool</h3>
      
      <div className="relative bg-zinc-100 rounded p-3 mb-3 overflow-x-auto">
        <pre className="text-xs text-zinc-700 whitespace-pre-wrap">
          {getEmbedCode()}
        </pre>
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 flex items-center justify-center"
          onClick={handleCopyCode}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-blue-600 hover:underline focus:outline-none"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleCopyCode}
          className="text-xs py-1 px-2 h-auto"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      </div>
      
      {showAdvanced && (
        <div className="pt-3 border-t mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="width" className="block text-xs font-medium text-zinc-700 mb-1">
                Width
              </label>
              <input
                type="text"
                id="width"
                name="width"
                value={embedOptions.width}
                onChange={handleOptionChange}
                className="w-full p-1.5 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-xs font-medium text-zinc-700 mb-1">
                Height
              </label>
              <input
                type="text"
                id="height"
                name="height"
                value={embedOptions.height}
                onChange={handleOptionChange}
                className="w-full p-1.5 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              name="showBranding"
              checked={embedOptions.showBranding}
              onChange={handleOptionChange}
              className="mr-2"
            />
            <span className="text-xs">Include TheMoneyGate branding</span>
          </label>
          
          <div className="bg-amber-50 p-2 rounded text-xs text-amber-700">
            <p>Embedding this tool will allow your website visitors to use it directly on your site, potentially increasing engagement and conversions.</p>
            <p className="mt-1">The embed code will work correctly regardless of which domain TheMoneyGate is hosted on.</p>
          </div>
        </div>
      )}
    </div>
  );
}
