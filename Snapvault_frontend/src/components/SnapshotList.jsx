import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, Box, RefreshCw } from 'lucide-react';

function SnapshotList({ onSelectSnapshot }) {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch data from Spring Boot
  const fetchSnapshots = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/snapshots');
      // Sort by latest first (Frontend sorting as a backup)
      const sorted = response.data.sort((a, b) => 
        new Date(b.snapshotTimestamp) - new Date(a.snapshotTimestamp)
      );
      setSnapshots(sorted);
    } catch (error) {
      console.error("Failed to load snapshots", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchSnapshots();
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 h-[500px] flex flex-col shadow-lg">
      
      {/* Header with Refresh Button */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-gray-200 font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Timeline
        </h3>
        <button 
          onClick={fetchSnapshots} 
          className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition"
          title="Refresh History"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* The List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {snapshots.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-10 text-sm">
            No snapshots found. <br/> Run a scan above!
          </div>
        )}

        {snapshots.map((snap) => (
          <div 
            key={snap.id}
            onClick={() => onSelectSnapshot(snap.id)} // Tell parent which ID was clicked
            className="group p-3 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:bg-gray-700"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-blue-400 font-mono text-xs bg-blue-400/10 px-2 py-0.5 rounded">
                ID: {snap.id}
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(snap.snapshotTimestamp).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-gray-400 group-hover:text-white" />
              <span className="font-semibold text-gray-300 group-hover:text-white truncate">
                {snap.snapShotName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SnapshotList;