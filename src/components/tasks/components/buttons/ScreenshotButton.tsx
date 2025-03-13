
import React from 'react';
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface ScreenshotButtonProps {
  hasImage: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({
  hasImage,
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-7 px-2 flex items-center gap-1 text-xs"
    >
      <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
      <span>{hasImage ? 'View' : 'Add'}</span>
    </Button>
  );
};
