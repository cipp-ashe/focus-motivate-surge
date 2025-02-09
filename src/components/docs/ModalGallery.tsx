
import React, { useState } from 'react';
import { EmailModal } from './gallery/EmailModal';
import { CelebrationModal } from './gallery/CelebrationModal';
import { TechnicalDetails } from './gallery/TechnicalDetails';

export const ModalGallery: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <section id="modals" className="space-y-8">
      <header className="text-center space-y-4">
        <h2 className="text-3xl font-semibold text-primary">Modal Gallery</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Interactive modal components with accessibility features and state management
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Email Summary Modal */}
        <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-medium">Email Summary Modal</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Task summary email composer with metrics visualization
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Technical Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Completed tasks sent directly to your email</li>
                <li>• Edge Functions via Supabase for Resend emailing</li>
                <li>• Clears completed task list on send</li>
                <li>• No data retention</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveModal('email')}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Email Modal
            </button>
          </div>
        </div>

        {/* Completion Celebration Modal */}
        <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-medium">Completion Celebration</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Task completion celebration with confetti and metrics display
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Technical Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Canvas-based confetti animation</li>
                <li>• Dynamic metrics calculation</li>
                <li>• Responsive layout adaptation</li>
                <li>• Focus trap for keyboard navigation</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveModal('celebration')}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Show Celebration
            </button>
          </div>
        </div>
      </div>

      {/* Technical Implementation Details */}
      <TechnicalDetails />

      {/* Modal Instances */}
      <EmailModal 
        isActive={activeModal === 'email'} 
        onClose={() => setActiveModal(null)} 
      />
      <CelebrationModal 
        isActive={activeModal === 'celebration'} 
        onClose={() => setActiveModal(null)} 
      />
    </section>
  );
};
