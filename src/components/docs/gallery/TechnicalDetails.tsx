
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings2, Code } from "lucide-react";

export const TechnicalDetails: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="max-w-3xl mx-auto w-full">
      <AccordionItem value="technical">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            <span>Technical Implementation</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 p-4">
            <div>
              <h4 className="font-medium mb-2">Modal Architecture</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium">Email Summary Modal</h5>
                  <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`// Email Summary Modal Architecture
<Dialog>
  <DialogTrigger />
  <DialogContent>
    <MetricsDisplay />    {/* Task metrics visualization */}
    <QuotesList />        {/* Selected motivational quotes */}
    <EmailForm           {/* Form with validation */}
      onSubmit={handleEmailSend}
      validate={validateEmail}
    />
  </DialogContent>
</Dialog>`}</code>
                  </pre>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Base Dialog Component</h5>
                  <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`// Radix UI Dialog with custom styling
const Dialog = styled(RadixDialog.Root, {
  '&[data-state="open"]': {
    animation: \`\${fadeIn} 200ms ease-out\`
  },
  '&[data-state="closed"]': {
    animation: \`\${fadeOut} 200ms ease-in\`
  }
});`}</code>
                  </pre>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Focus Management</h5>
                  <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`// Custom focus trap hook
const useFocusTrap = (isOpen: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      const focusable = ref.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      // Focus trap implementation
    }
  }, [isOpen]);
  
  return ref;
};`}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Animation System</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium">Modal Transitions</h5>
                  <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}`}</code>
                  </pre>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Confetti Animation</h5>
                  <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: random(-3, 3),
      y: random(-7, -3)
    };
  }
  // Physics simulation
}`}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Accessibility Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Code className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-foreground">ARIA Attributes</strong>
                    <p>Proper role and state management for screen readers</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Code className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-foreground">Keyboard Navigation</strong>
                    <p>Full keyboard support with focus management</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Code className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-foreground">Motion Preferences</strong>
                    <p>Respects reduced-motion settings for animations</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
