
import React from 'react';

const BackgroundDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-[10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-primary/10 rounded-full filter blur-[120px] opacity-70 animate-float"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] max-w-[700px] max-h-[700px] bg-purple-500/10 rounded-full filter blur-[120px] opacity-50" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
      <div className="absolute top-[30%] right-[15%] w-[20vw] h-[20vw] max-w-[400px] max-h-[400px] bg-blue-400/10 rounded-full filter blur-[80px] opacity-30" style={{ animationDelay: '1s', animationDuration: '12s' }}></div>
    </div>
  );
};

export default BackgroundDecorations;
