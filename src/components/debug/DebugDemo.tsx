
import React, { useState, useEffect, useCallback } from 'react';
import { withDebugging } from '@/hooks/debug/withDebugging';
import { useStateDebugger } from '@/hooks/debug/useStateDebugger';
import { useRenderTimer } from '@/hooks/debug/useRenderTimer';
import { useLifecycleTracker } from '@/hooks/debug/useLifecycleTracker';
import { useEffectDebugger } from '@/hooks/debug/useEffectDebugger';

interface DebugDemoProps {
  initialCount?: number;
  title?: string;
}

const DebugDemoComponent: React.FC<DebugDemoProps> = ({ 
  initialCount = 0,
  title = "Debug Demo"
}) => {
  // State for our component
  const [count, setCount] = useState(initialCount);
  const [text, setText] = useState('');
  const [items, setItems] = useState<string[]>([]);
  
  // Use our debug hooks
  useStateDebugger('DebugDemo', { count, text, items });
  useRenderTimer('DebugDemo');
  useLifecycleTracker('DebugDemo', [count, text]);
  
  // A useCallback function for demonstration
  const addItem = useCallback(() => {
    if (!text) return;
    
    setItems(prev => [...prev, text]);
    setText('');
  }, [text]);
  
  // Debug an effect
  useEffectDebugger(() => {
    if (count % 5 === 0 && count > 0) {
      console.log('Count is a multiple of 5!');
    }
    
    return () => {
      console.log('Count effect cleanup');
    };
  }, [count], {
    componentName: 'DebugDemo',
    effectName: 'countEffect'
  });
  
  // Simulate a slow operation for testing
  useEffect(() => {
    const start = performance.now();
    while (performance.now() - start < (count > 10 ? 20 : 1)) {
      // Artificially slow down when count > 10
    }
  }, [count]);
  
  return (
    <div className="p-4 border rounded shadow-sm bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      
      <div className="space-y-4">
        <div>
          <p>Count: {count}</p>
          <div className="flex space-x-2 mt-2">
            <button 
              onClick={() => setCount(c => c - 1)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Decrement
            </button>
            <button 
              onClick={() => setCount(c => c + 1)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Increment
            </button>
            <button 
              onClick={() => setCount(initialCount)}
              className="px-3 py-1 bg-gray-500 text-white rounded"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div>
          <p>Text Input:</p>
          <div className="flex space-x-2 mt-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              className="px-3 py-1 border rounded dark:bg-gray-700"
              placeholder="Enter text"
            />
            <button 
              onClick={addItem}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Add Item
            </button>
          </div>
        </div>
        
        {items.length > 0 && (
          <div>
            <p>Items:</p>
            <ul className="list-disc pl-5 mt-2">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              onClick={() => setItems([])}
              className="px-3 py-1 bg-gray-500 text-white rounded mt-2"
            >
              Clear Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Apply debugging HOC
export const DebugDemo = withDebugging(DebugDemoComponent, 'DebugDemo');
