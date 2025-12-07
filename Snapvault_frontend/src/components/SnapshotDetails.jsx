import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { File, HardDrive, DownloadCloud, Check } from 'lucide-react';

function SnapshotDetails({ snapshotId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Track which files are currently being restored (for loading spinners)
  const [restoringFiles, setRestoringFiles] = useState({}); 

  useEffect(() => {
    if (!snapshotId) return;
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/snapshots/${snapshotId}`);
        setFiles(response.data);
      } catch (error) {
        console.error("Failed to load files", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [snapshotId]);

  // --- RESTORE HANDLER ---
  const handleRestore = async (file) => {
    // 1. Mark this specific file as "Loading"
    setRestoringFiles(prev => ({ ...prev, [file.originalPath]: 'loading' }));
    
    try {
        
        const payload = {
            restorePath: "D:/Restored_Files" // <--- HARDCODED FOR DEMO
        };

        await axios.post(`http://localhost:8080/api/v1/snapshots/${snapshotId}/restore`, payload);
        
        // 3. Success State
        setRestoringFiles(prev => ({ ...prev, [file.originalPath]: 'success' }));
        
        // Reset after 2 seconds
        setTimeout(() => {
            setRestoringFiles(prev => {
                const newState = { ...prev };
                delete newState[file.originalPath];
                return newState;
            });
        }, 2000);

    } catch (error) {
        console.error("Restore failed", error);
        setRestoringFiles(prev => ({ ...prev, [file.originalPath]: 'error' }));
        alert("Restore Failed: " + error.message);
    }
  };

  if (!snapshotId) return <div className="text-gray-500 text-center mt-20">Select a snapshot to view details</div>;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
        <h3 className="text-gray-200 font-bold flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-purple-400" />
          Snapshot Contents 
          <span className="text-xs font-normal text-gray-500 ml-2">#{snapshotId}</span>
        </h3>
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">
          {files.length} Files
        </span>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto bg-gray-950">
        {loading ? (
           <div className="flex items-center justify-center h-full text-gray-500">
             <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
             Loading...
           </div>
        ) : files.length === 0 ? (
           <div className="text-center text-gray-500 mt-20">This snapshot is empty.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-900 text-gray-500 uppercase text-xs sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 font-medium">File Path</th>
                <th className="px-6 py-3 font-medium">Size</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {files.map((file, index) => {
                const status = restoringFiles[file.originalPath]; // 'loading', 'success', or undefined

                return (
                    <tr key={index} className="hover:bg-gray-900 transition-colors group">
                    <td className="px-6 py-3 font-mono text-gray-300 flex items-center gap-3">
                        <File className="w-4 h-4 text-blue-500" />
                        {file.originalPath}
                    </td>
                    <td className="px-6 py-3 text-xs">{file.size} B</td>
                    <td className="px-6 py-3 text-right">
                        <button 
                            onClick={() => handleRestore(file)}
                            disabled={status === 'loading'}
                            className={`text-xs px-3 py-1.5 rounded border transition flex items-center gap-1 ml-auto ${
                                status === 'success' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                : 'text-blue-400 border-blue-500/30 hover:bg-blue-600 hover:text-white'
                            }`}
                        >
                            {status === 'loading' && <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"/>}
                            {status === 'success' && <Check className="w-3 h-3"/>}
                            {status === 'loading' ? 'Restoring...' : status === 'success' ? 'Restored' : 'Restore'}
                        </button>
                    </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SnapshotDetails;