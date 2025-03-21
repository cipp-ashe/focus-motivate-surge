
import React from 'react';

const BackgroundDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Main background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/95" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-[10%] w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-40 animate-float-left"></div>
      <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-30 animate-float-right" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-violet-400/10 rounded-full filter blur-3xl opacity-20 animate-float-top" style={{ animationDelay: '1s' }}></div>
      
      {/* Additional soft glows */}
      <div className="absolute top-[30%] left-[20%] w-96 h-96 bg-blue-400/5 rounded-full filter blur-3xl opacity-30 animate-float-top" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-[40%] left-[5%] w-64 h-64 bg-teal-400/5 rounded-full filter blur-3xl opacity-20 animate-float-right" style={{ animationDelay: '2.5s' }}></div>
    </div>
  );
};

export default BackgroundDecorations;
