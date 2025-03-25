
import React, { useState } from 'react';
import { useDebugContext } from '@/contexts/debug/DebugContext';
import { X, ChevronUp, ChevronDown, RotateCw, Database, Clock, Activity } from 'lucide-react';

/**
 * Floating debug panel for monitoring state and renders
 */
export function DebugPanel() {
  const { 
    isEnabled, 
    toggleDebugging, 
    componentRenderCounts, 
    stateChanges, 
    renderTimings,
    clearLogs
  } = useDebugContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'renders' | 'state' | 'timing'>('renders');
  
  if (!isEnabled) {
    return (
      <button
        onClick={toggleDebugging}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50 opacity-50 hover:opacity-100"
        title="Enable Debug Mode"
      >
        <Database className="h-5 w-5" />
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col">
      {isOpen ? (
        <div className="bg-gray-800 text-white rounded-lg shadow-lg w-96 max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-2 border-b border-gray-700">
            <div className="text-sm font-medium">React Debug Panel</div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={clearLogs}
                className="p-1 rounded hover:bg-gray-700"
                title="Clear logs"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-700"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button 
                onClick={toggleDebugging}
                className="p-1 rounded hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 p-2 text-xs font-medium ${activeTab === 'renders' ? 'bg-gray-700' : ''}`}
              onClick={() => setActiveTab('renders')}
            >
              <div className="flex items-center justify-center">
                <Activity className="h-3 w-3 mr-1" />
                Renders
              </div>
            </button>
            <button
              className={`flex-1 p-2 text-xs font-medium ${activeTab === 'state' ? 'bg-gray-700' : ''}`}
              onClick={() => setActiveTab('state')}
            >
              <div className="flex items-center justify-center">
                <Database className="h-3 w-3 mr-1" />
                State
              </div>
            </button>
            <button
              className={`flex-1 p-2 text-xs font-medium ${activeTab === 'timing' ? 'bg-gray-700' : ''}`}
              onClick={() => setActiveTab('timing')}
            >
              <div className="flex items-center justify-center">
                <Clock className="h-3 w-3 mr-1" />
                Timing
              </div>
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2">
            {activeTab === 'renders' && (
              <div className="space-y-1">
                <div className="text-xs text-gray-400">Component Render Counts</div>
                {Object.entries(componentRenderCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([component, count]) => (
                    <div key={component} className="flex justify-between text-xs py-1 border-b border-gray-700">
                      <div className="truncate">{component}</div>
                      <div className={`ml-2 ${count > 10 ? 'text-red-400' : count > 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {count}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            
            {activeTab === 'state' && (
              <div className="space-y-1">
                <div className="text-xs text-gray-400">Recent State Changes</div>
                {stateChanges.slice().reverse().map((change, index) => (
                  <div key={index} className="text-xs py-1 border-b border-gray-700">
                    <div className="flex justify-between">
                      <div className="font-medium truncate">{change.component}</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(change.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-gray-400 truncate">{change.stateName}:</div>
                    <div className="text-green-400 truncate">
                      {JSON.stringify(change.newValue).substring(0, 100)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'timing' && (
              <div className="space-y-1">
                <div className="text-xs text-gray-400">Render Timing (average ms)</div>
                {Object.entries(renderTimings)
                  .sort(([, a], [, b]) => {
                    const avgA = a.reduce((sum, t) => sum + t, 0) / a.length;
                    const avgB = b.reduce((sum, t) => sum + t, 0) / b.length;
                    return avgB - avgA;
                  })
                  .map(([component, timings]) => {
                    const avg = timings.reduce((sum, t) => sum + t, 0) / timings.length;
                    return (
                      <div key={component} className="flex justify-between text-xs py-1 border-b border-gray-700">
                        <div className="truncate">{component}</div>
                        <div className={`ml-2 ${avg > 16 ? 'text-red-400' : avg > 8 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {avg.toFixed(2)}ms
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-800 text-white p-2 rounded-lg shadow-lg flex items-center"
        >
          <Database className="h-5 w-5 mr-2" />
          <span className="text-sm">Debug</span>
          <ChevronUp className="h-4 w-4 ml-2" />
        </button>
      )}
    </div>
  );
}
