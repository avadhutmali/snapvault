import React from 'react'
import UploadZone from './components/UploadZone'
import RepoConnect from './components/RepoConnect'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 1. Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">SV</div>
              <span className="text-xl font-bold tracking-tight">SnapVault</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-sm text-gray-400">v1.0 Local</span>
               <button className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition">
                  Docs
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Secure your files. Forever.
            </h1>
            <p className="text-gray-400 text-lg">
                SnapVault creates immutable snapshots of your directory. 
                Upload once, recover anytime.
            </p>
        </div>

        {/* The Upload Zone */}
        <div className="bg-gray-800/50 p-1 rounded-2xl border border-gray-700 shadow-2xl">
            <RepoConnect/>
        </div>

        {/* Recent Snapshots Placeholder (We will build this tomorrow) */}
        <div className="mt-12">
            <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-500 pl-3">Recent Activity</h3>
            <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-500 border border-gray-700">
                No snapshots found. Upload a file to start tracking.
            </div>
        </div>

      </main>
    </div>
  )
}

export default App