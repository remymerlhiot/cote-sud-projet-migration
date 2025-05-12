
import React from "react";

interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className = "" }: SpinnerProps) => {
  return (
    <div className="flex justify-center items-center h-40">
      <div 
        className={`animate-spin rounded-full h-10 w-10 border-4 border-solid border-t-transparent border-[#C8A977] ${className}`} 
        role="status"
      >
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
};
