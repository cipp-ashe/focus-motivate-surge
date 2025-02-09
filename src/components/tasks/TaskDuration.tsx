
import { Clock } from "lucide-react";
import { Input } from "../ui/input";

interface TaskDurationProps {
  durationInMinutes: number;
  isEditing: boolean;
  inputValue: string;
  onDurationClick: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskDuration = ({
  durationInMinutes,
  isEditing,
  inputValue,
  onDurationClick,
  onChange,
  onBlur,
  onKeyDown,
  preventPropagation,
}: TaskDurationProps) => {
  return (
    <div 
      className="flex items-center gap-2 min-w-[100px] justify-end"
      onClick={preventPropagation}
      onTouchStart={preventPropagation}
    >
      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
      {isEditing ? (
        <Input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={inputValue}
          className="w-16 text-right bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus
          onClick={preventPropagation}
          onTouchStart={preventPropagation}
        />
      ) : (
        <span 
          className="w-16 text-right text-muted-foreground cursor-text"
          onClick={onDurationClick}
          onTouchStart={onDurationClick}
        >
          {durationInMinutes}
        </span>
      )}
      <span className="text-muted-foreground shrink-0">m</span>
    </div>
  );
};
