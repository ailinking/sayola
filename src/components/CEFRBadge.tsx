import React, { useState } from 'react';
import { CEFRLevel, CEFRClassification, CEFRService } from '../lib/cefrService';

interface CEFRBadgeProps {
  word: string;
  classification?: CEFRClassification;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  showConfidence?: boolean;
  className?: string;
}

export const CEFRBadge: React.FC<CEFRBadgeProps> = ({
  word,
  classification,
  size = 'md',
  showTooltip = true,
  showConfidence = false,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get classification if not provided
  const cefrData = classification || CEFRService.classifyWord(word);
  const levelInfo = CEFRService.getLevelInfo(cefrData.level);
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };
  
  const badgeClasses = `
    inline-flex items-center rounded-full font-medium border
    ${levelInfo.color}
    ${sizeClasses[size]}
    ${showTooltip ? 'cursor-help' : ''}
    ${className}
  `;
  
  const Badge = (
    <span
      className={badgeClasses}
      onMouseEnter={() => showTooltip && setShowDetails(true)}
      onMouseLeave={() => showTooltip && setShowDetails(false)}
      title={showTooltip ? `${levelInfo.name}: ${levelInfo.description}` : undefined}
    >
      {cefrData.level}
      {showConfidence && (
        <span className="ml-1 text-xs opacity-75">
          ({Math.round(cefrData.confidence * 100)}%)
        </span>
      )}
    </span>
  );
  
  if (!showTooltip) {
    return Badge;
  }
  
  return (
    <div className="relative inline-block">
      {Badge}
      
      {/* Tooltip */}
      {showDetails && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64">
          <div className={`
            rounded-lg shadow-lg border p-3 text-sm
            ${levelInfo.bgColor} border-gray-200
            bg-white
          `}>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-t-white"></div>
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${levelInfo.textColor}`}>
                  {cefrData.level} - {levelInfo.name}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(cefrData.confidence * 100)}% confidence
                </span>
              </div>
              
              <p className="text-gray-700 text-xs">
                {levelInfo.description}
              </p>
              
              <div className="text-xs text-gray-600">
                <strong>Classification:</strong> {cefrData.reasoning}
              </div>
              
              {levelInfo.examples.length > 0 && (
                <div className="text-xs">
                  <strong className="text-gray-700">Similar words:</strong>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {levelInfo.examples.slice(0, 3).map((example, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// CEFR Level Legend Component
export const CEFRLegend: React.FC<{ className?: string }> = ({ className = '' }) => {
  const levels = CEFRService.getAllLevels();
  
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">CEFR Proficiency Levels</h3>
      <div className="grid grid-cols-2 gap-2">
        {levels.map((level) => (
          <div key={level.level} className="flex items-center space-x-2">
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
              ${level.color}
            `}>
              {level.level}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-700">{level.name}</div>
              <div className="text-xs text-gray-500 truncate">{level.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// CEFR Progress Bar Component
export const CEFRProgressBar: React.FC<{
  level: CEFRLevel;
  className?: string;
}> = ({ level, className = '' }) => {
  const score = CEFRService.getDifficultyScore(level);
  const percentage = (score / 5) * 100;
  const levelInfo = CEFRService.getLevelInfo(level);
  
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">Difficulty</span>
        <span className={levelInfo.textColor}>{level}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            score <= 1 ? 'bg-green-500' :
            score <= 2 ? 'bg-blue-500' :
            score <= 3 ? 'bg-yellow-500' :
            score <= 4 ? 'bg-orange-500' :
            'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CEFRBadge;