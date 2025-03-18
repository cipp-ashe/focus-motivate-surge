
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Clock, 
  ListTodo,
  BookOpen, 
  Timer, 
  Activity,
  Image,
  Mic,
  Tag,
  FileText,
  LayoutDashboard,
  Zap,
  CalendarCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { cn } from '@/lib/utils';

const IndexAlternative = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-primary/10 rounded-full filter blur-[120px] opacity-70 animate-float"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] max-w-[700px] max-h-[700px] bg-purple-500/10 rounded-full filter blur-[120px] opacity-50" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute top-[30%] right-[15%] w-[20vw] h-[20vw] max-w-[400px] max-h-[400px] bg-blue-400/10 rounded-full filter blur-[80px] opacity-30" style={{ animationDelay: '1s', animationDuration: '12s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - Enhanced with more modern styling */}
        <section className="mb-16 md:mb-24">
          <div className="flex flex-col items-center text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 mr-1" />
              Productivity Reimagined
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-primary max-w-4xl leading-tight">
              Organize Your Work, Automate Your Habits
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
              FlowTime combines task management, habit automation, and focused work sessions
              in one powerful, privacy-focused application.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 shadow-glow button-glow">
                <Link to="/tasks">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-primary/10">
                <Link to="/habits">
                  Explore Habits <Activity className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Hero Habit Automation Showcase - Enhanced with sleeker styling */}
          <div className="bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-transparent dark:from-amber-950/30 dark:via-amber-950/10 dark:to-transparent border border-amber-100/50 dark:border-amber-800/30 rounded-xl overflow-hidden shadow-xl mb-12 backdrop-blur-sm">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-amber-400/20 p-3 rounded-full">
                  <Activity className="w-6 h-6 text-amber-500" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl md:text-3xl font-bold">Habit Automation</h2>
                  <p className="text-muted-foreground">Configure once, automate your daily workflow</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Morning Workout Example - Left-aligned titles and enhanced styling */}
                <div className="bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-lg border border-amber-200/50 dark:border-amber-800/30 p-5 shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-400/20 h-10 w-10 rounded-full flex items-center justify-center">
                      <Timer className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold">Morning Workout</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-none">habit</Badge>
                        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-none flex items-center gap-1">
                          <Clock className="h-3 w-3" /> 25 min
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="pl-12 border-l-2 border-blue-200 dark:border-blue-800/50 ml-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 text-left">
                      <Tag className="h-3.5 w-3.5 text-primary/70" />
                      <span>fitness, morning-routine</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">Auto-creates a timed task with proper tags</p>
                  </div>
                </div>
                
                {/* Daily Journal Example - Left-aligned titles and enhanced styling */}
                <div className="bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-lg border border-green-200/50 dark:border-green-800/30 p-5 shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-400/20 h-10 w-10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold">Evening Reflection</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-none">journal</Badge>
                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-900/40 text-gray-800 dark:text-gray-300 border-none flex items-center gap-1">
                          <CalendarCheck className="h-3 w-3" /> daily
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="pl-12 border-l-2 border-green-200 dark:border-green-800/50 ml-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 text-left">
                      <Tag className="h-3.5 w-3.5 text-primary/70" />
                      <span>journal, reflection</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">Auto-generates a journal entry with prompts</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild variant="default" size="lg" className="bg-amber-500 hover:bg-amber-600 rounded-full shadow-glow button-glow">
                  <Link to="/habits" className="flex items-center gap-2">
                    Configure Your Habits <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Features Section - Enhanced with sleeker styling */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete productivity suite with powerful features to streamline your work
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tasks Card - Enhanced styling */}
            <Card className="border-primary/10 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-left">Task Management</CardTitle>
                <CardDescription className="text-left">Organize all your work in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4 text-left">
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">Smart task organization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">Integrated with timers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">Tagging system</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full button-glow" variant="default">
                  <Link to="/tasks">Go to Tasks</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Timer Card - Enhanced styling */}
            <Card className="border-primary/10 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 dark:to-transparent shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-[#9b87f5]/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <Timer className="h-6 w-6 text-[#9b87f5]" />
                </div>
                <CardTitle className="text-left">Focus Timers</CardTitle>
                <CardDescription className="text-left">Track time spent on tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4 text-left">
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-[#9b87f5]/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-[#9b87f5]" />
                    </div>
                    <span className="text-sm">Customizable timers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-[#9b87f5]/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-[#9b87f5]" />
                    </div>
                    <span className="text-sm">Session tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-[#9b87f5]/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-[#9b87f5]" />
                    </div>
                    <span className="text-sm">Productivity metrics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full button-glow" variant="default" style={{ backgroundColor: "#9b87f5", borderColor: "#9b87f5" }}>
                  <Link to="/timer">Use Timer</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Notes Card - Enhanced styling */}
            <Card className="border-primary/10 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20 dark:to-transparent shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-green-400/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-left">Notes & Journals</CardTitle>
                <CardDescription className="text-left">Capture ideas and reflections</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4 text-left">
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-400/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="text-sm">Written notes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-400/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="text-sm">Voice recordings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-400/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="text-sm">Journal templates</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full button-glow" variant="default" style={{ backgroundColor: "rgb(74, 222, 128)", borderColor: "rgb(74, 222, 128)" }}>
                  <Link to="/notes">View Notes</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        
        {/* Quick Access Section - Enhanced with sleeker styling */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary/70" />
            Quick Access
          </h2>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
            <Link to="/tasks" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-md border border-gray-100 dark:border-gray-800/50 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-primary/5">
              <div className="bg-primary/10 rounded-full p-3 mb-1">
                <ListTodo className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Tasks</span>
            </Link>
            
            <Link to="/timer" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-md border border-gray-100 dark:border-gray-800/50 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-[#9b87f5]/5">
              <div className="bg-[#9b87f5]/10 rounded-full p-3 mb-1">
                <Timer className="w-5 h-5 text-[#9b87f5]" />
              </div>
              <span className="text-sm font-medium">Timer</span>
            </Link>
            
            <Link to="/habits" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-md border border-gray-100 dark:border-gray-800/50 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-amber-400/5">
              <div className="bg-amber-400/10 rounded-full p-3 mb-1">
                <Activity className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm font-medium">Habits</span>
            </Link>
            
            <Link to="/screenshots" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-md border border-gray-100 dark:border-gray-800/50 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-blue-400/5">
              <div className="bg-blue-400/10 rounded-full p-3 mb-1">
                <Image className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm font-medium">Screenshots</span>
            </Link>
            
            <Link to="/notes" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-md border border-gray-100 dark:border-gray-800/50 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-green-400/5">
              <div className="bg-green-400/10 rounded-full p-3 mb-1">
                <BookOpen className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-sm font-medium">Notes</span>
            </Link>
            
            <Link to="/voice-notes" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-md border border-gray-100 dark:border-gray-800/50 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-rose-400/5">
              <div className="bg-rose-400/10 rounded-full p-3 mb-1">
                <Mic className="w-5 h-5 text-rose-400" />
              </div>
              <span className="text-sm font-medium">Voice</span>
            </Link>
            
            <Link to="/tasks" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-md border border-gray-100 dark:border-gray-800/50 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-cyan-400/5">
              <div className="bg-cyan-400/10 rounded-full p-3 mb-1">
                <CalendarCheck className="w-5 h-5 text-cyan-500" />
              </div>
              <span className="text-sm font-medium">Today</span>
            </Link>
            
            <Link to="/settings" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-md border border-gray-100 dark:border-gray-800/50 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-gray-400/5">
              <div className="bg-gray-400/10 rounded-full p-3 mb-1">
                <Mic className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </div>
        </section>
        
        {/* Privacy Section - Enhanced with sleeker styling */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900/30 dark:to-transparent border border-gray-100 dark:border-gray-800/30 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">Your Data is Stored Locally</h3>
                <p className="text-muted-foreground mb-4">
                  FlowTime saves your data to your browser's local storage. For access across multiple devices, 
                  register with a magic link on the settings page.
                </p>
                <Button asChild variant="outline" size="sm" className="rounded-full border-primary/20 hover:bg-primary/10">
                  <Link to="/settings">
                    Settings <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer - Enhanced with sleeker styling */}
        <footer className="text-center mt-16 mb-8">
          <Button 
            asChild 
            variant="outline" 
            className="bg-card/80 backdrop-blur-sm rounded-full px-6 shadow-glass border-primary/20 hover:bg-primary/10 button-scale"
          >
            <Link to="/tasks" className="flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 arrow-slide-right" />
            </Link>
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default IndexAlternative;
