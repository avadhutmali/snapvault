import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HardDrive, Play, File, Clock, PlusCircle, LayoutGrid, X, MessageSquare, Check } from 'lucide-react';
import SnapshotDetails from './components/SnapshotDetails';
import RepoConnect from './components/RepoConnect';

function App() {
  const [snapshots, setSnapshots] = useState([]); 
  const [projects, setProjects] = useState([]);   
  const [selectedPath, setSelectedPath] = useState(null); 
  const [projectCommits, setProjectCommits] = useState([]); 
  const [selectedCommitId, setSelectedCommitId] = useState(null); 
  
  const [isScanning, setIsScanning] = useState(false);
  
  // MODAL STATES
  const [showAddModal, setShowAddModal] = useState(false); 
  const [showScanModal, setShowScanModal] = useState(false); // <--- NEW: Controls the Commit Modal
  const [commitMessage, setCommitMessage] = useState("");    // <--- NEW: Stores the message

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/snapshots');
      setSnapshots(res.data);
      const uniquePaths = [...new Set(res.data.map(item => item.directoryPath).filter(Boolean))];
      setProjects(uniquePaths);
      if (selectedPath) {
        updateCommitList(selectedPath, res.data);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const updateCommitList = (path, allData = snapshots) => {
    const commits = allData
        .filter(snap => snap.directoryPath === path)
        .sort((a, b) => new Date(b.snapshotTimestamp) - new Date(a.snapshotTimestamp));
    setProjectCommits(commits);
  };

  const getProjectName = (path) => {
    // Find any snapshot with this path and return its project name
    const found = snapshots.find(s => s.directoryPath === path);
    return found ? found.projectName : path.split('/').pop(); // Fallback to folder name
  };

  const handleSelectProject = (path) => {
    setSelectedPath(path);
    setSelectedCommitId(null);
    updateCommitList(path);
    setShowAddModal(false);
  };

  // 1. OPEN THE MODAL (Don't scan yet)
  const openScanModal = () => {
      setCommitMessage(""); // Reset message
      setShowScanModal(true);
  };

  // 2. ACTUAL SCAN LOGIC (Called by Modal)
  const executeScan = async () => {
    if(!selectedPath) return;
    setIsScanning(true);
    try {
        await axios.post('http://localhost:8080/api/v1/snapshots', {
            directoryPath: selectedPath,
            // Use the custom message, or fall back to default
            snapShotName: commitMessage || "Update-" + new Date().toLocaleTimeString('en-US', {hour12: false})
        });
        await fetchData(); 
        setShowScanModal(false); // Close modal
    } catch(e) {
        alert("Scan Failed");
    } finally {
        setIsScanning(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center font-bold text-xs">SV</div>
            <span className="font-bold text-gray-200">SnapVault</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="text-xs font-bold text-gray-500 uppercase px-3 py-2">Projects</div>
            {projects.map(path => (
                <button 
                    key={path}
                    onClick={() => handleSelectProject(path)}
                    // ... className ...
                >
                    <div className="flex items-center gap-2 mb-1">
                        <HardDrive className={`w-3 h-3 ${selectedPath === path ? 'text-blue-400' : 'text-gray-600'}`}/>
                        
                        {/* SHOW PROJECT NAME HERE */}
                        <span className="font-bold truncate text-sm">
                            {getProjectName(path)}
                        </span>
                    </div>
                    {/* Show path smaller below */}
                    <div className="opacity-50 truncate text-[10px]">{path}</div>
                </button>
            ))}
        </div>
        <div className="p-3 border-t border-gray-800">
            <button onClick={() => setShowAddModal(true)} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-xs font-bold border border-gray-700 transition">
                <PlusCircle className="w-3 h-3" /> New Repository
            </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex relative">
        
        {/* MODAL 1: ADD NEW REPO */}
        {showAddModal && (
            <div className="absolute inset-0 z-50 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-10">
                <div className="w-full max-w-2xl relative">
                    <button onClick={() => setShowAddModal(false)} className="absolute -top-10 right-0 text-gray-400 hover:text-white"><X className="w-8 h-8"/></button>
                    <RepoConnect /> 
                    <div className="text-center mt-6">
                        <button onClick={fetchData} className="text-blue-400 text-sm hover:underline">Done? Click here to refresh list</button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL 2: COMMIT MESSAGE POPUP (NEW) */}
        {showScanModal && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl w-96 shadow-2xl transform transition-all scale-100">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-green-400"/> Commit Changes
                    </h3>
                    
                    <div className="mb-4">
                        <label className="text-xs text-gray-400 uppercase font-bold">Snapshot Name / Message</label>
                        <input 
                            autoFocus
                            type="text" 
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            className="w-full mt-2 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="e.g. Fixed styling bug..."
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowScanModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
                        <button 
                            onClick={executeScan}
                            disabled={isScanning}
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                        >
                            {isScanning ? <RefreshCw className="animate-spin w-4 h-4"/> : <Check className="w-4 h-4"/>}
                            Commit
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* MIDDLE COLUMN: HISTORY */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
           {selectedPath ? (
               <>
                  <div className="p-5 border-b border-gray-800 bg-gray-900">
                      <h2 className="font-bold text-sm text-gray-200 mb-1 truncate" title={selectedPath}>
                          {selectedPath.split('/').pop() || selectedPath.split('\\').pop()}
                      </h2>
                      <div className="text-[10px] text-gray-500 font-mono mb-4 truncate">{selectedPath}</div>
                      
                      {/* BUTTON OPENS MODAL NOW */}
                      <button 
                          onClick={openScanModal}
                          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-md font-bold text-sm shadow-lg shadow-green-900/20 transition"
                      >
                          <Play className="w-4 h-4 fill-current"/> Scan Changes
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2">
                      <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2 px-2 mt-2">Version History</div>
                      {projectCommits.map(snap => (
                          <div 
                              key={snap.id}
                              onClick={() => setSelectedCommitId(snap.id)}
                              className={`p-3 mb-2 rounded-lg border cursor-pointer transition relative ${selectedCommitId === snap.id ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-800'}`}
                          >
                              <div className="font-bold text-sm mb-1">{snap.snapShotName}</div>
                              <div className="flex items-center gap-1 text-[11px] opacity-60 font-mono">
                                  <Clock className="w-3 h-3"/>
                                  {new Date(snap.snapshotTimestamp).toLocaleString()}
                              </div>
                              {selectedCommitId === snap.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>}
                          </div>
                      ))}
                  </div>
               </>
           ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8 text-center">
                   <LayoutGrid className="w-12 h-12 mb-4 opacity-20"/>
                   <p className="text-sm">Select a project from the sidebar to view history.</p>
               </div>
           )}
        </div>

        {/* RIGHT COLUMN: FILES */}
        <div className="flex-1 bg-gray-950 flex flex-col overflow-hidden relative">
            {!selectedCommitId && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <File className="w-64 h-64"/>
                </div>
            )}
            {selectedCommitId ? (
               <SnapshotDetails snapshotId={selectedCommitId} /> 
            ) : (
               <div className="flex-1 flex items-center justify-center text-gray-600">
                  <div className="text-center"><p className="text-sm">Select a version to view files</p></div>
               </div>
            )}
        </div>

      </div>
    </div>
  )
}

export default App;