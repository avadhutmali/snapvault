import React, { useState, useRef } from 'react';
import { FolderOpen, Play, ClipboardCopy, HardDrive } from 'lucide-react';

function RepoConnect() {
  const [path, setPath] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  // Handle "Select Folder" Button click
  const handleFolderSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Note: Browsers protect the full path. 
      // This is a best-effort to grab the folder name or relative path.
      // Ideally, for a local dev tool, pasting the absolute path is safest.
      const file = files[0];
      // Some browsers expose webkitRelativePath
      const folderPath = file.webkitRelativePath.split('/')[0]; 
      setPath(folderPath + " (Please verify absolute path)"); 
    }
  };

  const handleScan = () => {
    if(!path) return;
    setIsScanning(true);
    console.log("Scanning Path:", path);
    // TODO: Call Backend API: POST /api/snapshot?path={path}
    setTimeout(() => setIsScanning(false), 2000); 
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
            <HardDrive className="w-6 h-6 text-blue-500" />
        </div>
        <div>
            <h2 className="text-lg font-bold text-white">Repository Connection</h2>
            <p className="text-xs text-gray-400">Initialize a directory to track snapshots</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Target Directory Path
        </label>
        
        <div className="flex gap-2">
            {/* The Text Input */}
            <div className="relative flex-1 group">
                <input 
                    type="text" 
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="block w-full bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3 font-mono text-sm transition-all" 
                    placeholder="Paste absolute path (e.g. D:/Projects/MyApp)" 
                />
                {/* Paste Shortcut (Optional visual) */}
                <div className="absolute right-3 top-3 text-gray-600 group-hover:text-gray-400 transition cursor-pointer" title="Paste Path">
                    <ClipboardCopy className="w-4 h-4" />
                </div>
            </div>

            {/* The "Choose Directory" Button */}
            <button 
                onClick={() => fileInputRef.current.click()}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 border border-gray-600"
            >
                <FolderOpen className="w-4 h-4" />
                Browse
            </button>
            
            {/* Hidden Input for Directory Selection */}
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden" 
                webkitdirectory="" 
                directory="" 
                multiple 
            />
        </div>
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full inline-block"></span>
            Note: For local tools, pasting the <strong>Absolute Path</strong> is recommended.
        </p>
      </div>

      {/* Action Area */}
      <div className="flex items-center justify-end pt-4 border-t border-gray-700/50">
        <button 
            onClick={handleScan}
            disabled={!path || isScanning}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
                isScanning 
                ? 'bg-blue-900/50 cursor-not-allowed text-blue-300' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20'
            }`}
        >
            {isScanning ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scanning...
                </>
            ) : (
                <>
                    <Play className="w-5 h-5 fill-current" />
                    Start Snapshot
                </>
            )}
        </button>
      </div>
    </div>
  );
}

export default RepoConnect;