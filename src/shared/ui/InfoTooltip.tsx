"use client";

import React, { useState } from "react";
import { QuestionIcon } from "@/shared/icons";

interface InfoTooltipProps {
  text: string;
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export default function InfoTooltip({
  text,
  className = "",
  iconClassName = "",
  tooltipClassName = "",
  position = "top"
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "top":
        return "top-full left-1/2 transform -translate-x-1/2 border-t-gray-800";
      case "bottom":
        return "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800";
      case "left":
        return "left-full top-1/2 transform -translate-y-1/2 border-l-gray-800";
      case "right":
        return "right-full top-1/2 transform -translate-y-1/2 border-r-gray-800";
      default:
        return "top-full left-1/2 transform -translate-x-1/2 border-t-gray-800";
    }
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <QuestionIcon
        className={`h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help ${iconClassName}`}
      />
      
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg ${getPositionClasses()} ${tooltipClassName}`}
          style={{ maxWidth: '400px', minWidth: '280px' }}
        >
          <div className="text-center">{text}</div>
          <div
            className={`absolute w-0 h-0 border-4 border-transparent ${getArrowClasses()}`}
          />
        </div>
      )}
    </div>
  );
}
