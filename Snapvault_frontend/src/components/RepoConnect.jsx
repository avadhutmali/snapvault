import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FolderOpen, Play, ClipboardCopy, HardDrive, CheckCircle, RefreshCw, XCircle, MessageSquare } from 'lucide-react';

function RepoConnect() {
  const [path, setPath] = useState('');
  const [projName, setProjName] = useState('');
  const [snapName, setSnapName] = useState('Initial Snapshot');
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  const handleFolderSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const folderName = file.webkitRelativePath.split('/')[0];
      setPath(`${folderName} (Please verify absolute path)`); 
    }
  };

  const handleConnect = () => {
    if(!path) return;
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setPath('');
    setSnapName('Initial Snapshot'); // Reset name
  };

  const handleScan = async () => {
    if(!path) return;
    setIsScanning(true);
    try {
        const payload = {
            directoryPath: path,
            snapShotName: snapName,
            projectName: projName || "Untitled Project"
        };

        await axios.post('http://localhost:8080/api/v1/snapshots', payload);
        alert("Project Initialized!"); 
        window.location.reload(); 

    } catch (error) {
        // ... error handling
    } finally {
        setIsScanning(false);
    }
  };
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg transition-all">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                {isConnected ? <CheckCircle className="w-6 h-6 text-green-500" /> : <HardDrive className="w-6 h-6 text-blue-500" />}
            </div>
            <div>
                <h2 className="text-lg font-bold text-white">
                    {isConnected ? 'Ready to Commit' : 'Initialize Repository'}
                </h2>
                <p className="text-xs text-gray-400">
                    {isConnected ? 'Review details and commit' : 'Select a folder to track'}
                </p>
            </div>
        </div>
        {isConnected && (
            <button onClick={handleDisconnect} className="text-gray-500 hover:text-red-400 text-xs flex items-center gap-1 transition">
                <XCircle className="w-4 h-4" /> Cancel
            </button>
        )}
      </div>

      {/* --- STEP 1: CHOOSE PATH --- */}
      {!isConnected && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Target Directory</label>
                <div className="flex gap-2">
                    <div className="relative flex-1 group">
                        <input 
                            type="text" 
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            className="block w-full bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 p-3 font-mono text-sm" 
                            placeholder="Paste absolute path..." 
                        />
                        <div className="absolute right-3 top-3 text-gray-600 group-hover:text-gray-400 transition cursor-pointer"><ClipboardCopy className="w-4 h-4" /></div>
                    </div>
                    <button onClick={() => fileInputRef.current.click()} className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg font-medium border border-gray-600">Browse</button>
                    <input type="file" ref={fileInputRef} onChange={handleFolderSelect} className="hidden" webkitdirectory="" directory="" multiple />
                </div>
            </div>
            <div className="flex justify-end">
                <button onClick={handleConnect} disabled={!path} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition disabled:opacity-50">
                    Next: Configure
                </button>
            </div>
          </div>
      )}

      {isConnected && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 animate-in zoom-in-95 duration-300 space-y-4">
            
            {/* 1. PROJECT NAME INPUT */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Project Name (Sidebar Label)
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HardDrive className="h-4 w-4 text-blue-500" />
                    </div>
                    <input 
                        type="text" 
                        value={projName}
                        onChange={(e) => setProjName(e.target.value)}
                        className="block w-full pl-10 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 p-2.5 text-sm" 
                        placeholder="e.g. SnapVault Backend" 
                    />
                </div>
            </div>

            {/* 2. COMMIT MESSAGE INPUT */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Initial Commit Message
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                    </div>
                    <input 
                        type="text" 
                        value={snapName}
                        onChange={(e) => setSnapName(e.target.value)}
                        className="block w-full pl-10 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 p-2.5 text-sm" 
                    />
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-gray-500 font-mono truncate max-w-[200px]">{path}</div>
                <button 
                    onClick={handleScan}
                    disabled={isScanning || !projName}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-500 shadow-lg"
                >
                    {isScanning ? 'Creating...' : 'Initialize Project'}
                </button>
            </div>
          </div>
      )}
    </div>
  );
}
export default RepoConnect;