
import React from 'react';

const BackgroundDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Main background gradient - adjusted to work in both light and dark mode */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
      
      {/* Decorative elements that work in both light and dark modes with improved contrast */}
      <div className="absolute top-0 left-[10%] w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-50 dark:opacity-30 animate-float-left"></div>
      <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-40 dark:opacity-20 animate-float-right" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-violet-400/10 rounded-full filter blur-3xl opacity-35 dark:opacity-15 animate-float-top" style={{ animationDelay: '1s' }}></div>
      
      {/* Additional soft glows with increased opacity for better visibility */}
      <div className="absolute top-[30%] left-[20%] w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-40 dark:opacity-20 animate-float-top" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-[40%] left-[5%] w-64 h-64 bg-accent/10 rounded-full filter blur-3xl opacity-35 dark:opacity-15 animate-float-right" style={{ animationDelay: '2.5s' }}></div>
    </div>
  );
};

export default BackgroundDecorations;
