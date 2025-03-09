
import { Link } from "react-router-dom";
import { Moon, Sun, StickyNote, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useHabitsPanel } from "@/hooks/useHabitsPanel";

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { toggle: toggleHabits } = useHabitsPanel();

  return (
    <div className="flex justify-between items-center mb-4 sm:mb-7">
      <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
        <Link to="/">Focus Timer</Link>
      </h1>
      <div className="flex items-center gap-2">
        <Link 
          to="/habits"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Habits"
        >
          <ActivitySquare className="h-5 w-5" />
        </Link>
        <Link 
          to="/notes"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Notes"
        >
          <StickyNote className="h-5 w-5" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full hover:bg-primary/20"
        >
          {isDark ? (
            <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Header;
