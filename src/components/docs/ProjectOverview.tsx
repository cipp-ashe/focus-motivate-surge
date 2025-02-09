import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Package, Code, Timer, Palette, BookOpen, Heart } from 'lucide-react';

const navigation = [
  {
    icon: Timer,
    label: 'Timer',
    href: '/',
  },
  {
    icon: Heart,
    label: 'Habits',
    href: '/habits',
  },
  {
    icon: BookOpen,
    label: 'Notes',
    href: '/notes',
  },
];

export const ProjectOverview = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          Project Overview
        </h1>
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      <div className="mt-12 max-w-3xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Package Details</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">React</span>
                <span className="text-xs text-muted-foreground">^18.2.0</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">TypeScript</span>
                <span className="text-xs text-muted-foreground">^5.0.2</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Vite</span>
                <span className="text-xs text-muted-foreground">^4.4.5</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Tailwind CSS</span>
                <span className="text-xs text-muted-foreground">^3.3.3</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Shadcn UI</span>
                <span className="text-xs text-muted-foreground">Latest</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <Accordion type="single" collapsible>
            <AccordionItem value="hooks-helper">
              <AccordionTrigger className="px-6">
                <div className="flex items-center gap-3">
                  <Code className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Custom Hooks & Utilities</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-1">useTimer</h3>
                    <p className="text-sm text-muted-foreground">
                      Manages timer state and controls with features like start, pause, and reset
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-1">useTaskManager</h3>
                    <p className="text-sm text-muted-foreground">
                      Handles task creation, updates, and state management
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-1">useQuoteManager</h3>
                    <p className="text-sm text-muted-foreground">
                      Manages inspirational quotes display and favorites
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-1">useTheme</h3>
                    <p className="text-sm text-muted-foreground">
                      Controls dark/light theme switching with system preference support
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <Accordion type="single" collapsible>
            <AccordionItem value="css-helper">
              <AccordionTrigger className="px-6">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Tailwind CSS Helper</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-primary text-primary-foreground text-center text-sm">
                        primary
                      </div>
                      <div className="p-3 rounded-lg bg-secondary text-secondary-foreground text-center text-sm">
                        secondary
                      </div>
                      <div className="p-3 rounded-lg bg-accent text-accent-foreground text-center text-sm">
                        accent
                      </div>
                      <div className="p-3 rounded-lg bg-muted text-muted-foreground text-center text-sm">
                        muted
                      </div>
                      <div className="p-3 rounded-lg bg-destructive text-destructive-foreground text-center text-sm">
                        destructive
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Border Radius</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="h-16 rounded-sm bg-muted flex items-center justify-center text-sm">
                        rounded-sm
                      </div>
                      <div className="h-16 rounded bg-muted flex items-center justify-center text-sm">
                        rounded
                      </div>
                      <div className="h-16 rounded-lg bg-muted flex items-center justify-center text-sm">
                        rounded-lg
                      </div>
                      <div className="h-16 rounded-xl bg-muted flex items-center justify-center text-sm">
                        rounded-xl
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Shadows</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="h-16 rounded-lg shadow bg-card flex items-center justify-center text-sm">
                        shadow
                      </div>
                      <div className="h-16 rounded-lg shadow-md bg-card flex items-center justify-center text-sm">
                        shadow-md
                      </div>
                      <div className="h-16 rounded-lg shadow-lg bg-card flex items-center justify-center text-sm">
                        shadow-lg
                      </div>
                      <div className="h-16 rounded-lg shadow-xl bg-card flex items-center justify-center text-sm">
                        shadow-xl
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {navigation.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              to={href}
              className="flex items-center gap-2 p-4 rounded-lg bg-card hover:bg-accent transition-colors duration-200"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
