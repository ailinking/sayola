import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { CEFRLevel, CEFRService } from '../lib/cefrService';

interface CEFRFilterProps {
  selectedLevels: CEFRLevel[];
  onLevelsChange: (levels: CEFRLevel[]) => void;
  className?: string;
}

export const CEFRFilter: React.FC<CEFRFilterProps> = ({
  selectedLevels,
  onLevelsChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const levels = CEFRService.getAllLevels();
  
  const handleLevelToggle = (level: CEFRLevel) => {
    if (selectedLevels.includes(level)) {
      onLevelsChange(selectedLevels.filter(l => l !== level));
    } else {
      onLevelsChange([...selectedLevels, level]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedLevels.length === levels.length) {
      onLevelsChange([]);
    } else {
      onLevelsChange(levels.map(l => l.level));
    }
  };
  
  const clearFilters = () => {
    onLevelsChange([]);
  };
  
  const hasActiveFilters = selectedLevels.length > 0 && selectedLevels.length < levels.length;
  
  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors
          ${hasActiveFilters 
            ? 'bg-blue-50 border-blue-200 text-blue-700' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">
          CEFR Level
          {hasActiveFilters && (
            <span className="ml-1 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
              {selectedLevels.length}
            </span>
          )}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors"
          title="Clear filters"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Filter by CEFR Level</h3>
              <button
                onClick={handleSelectAll}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedLevels.length === levels.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            {/* Level Options */}
            <div className="space-y-2">
              {levels.map((level) => {
                const isSelected = selectedLevels.includes(level.level);
                return (
                  <label
                    key={level.level}
                    className={`
                      flex items-center p-2 rounded-md cursor-pointer transition-colors
                      ${isSelected ? level.bgColor : 'hover:bg-gray-50'}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleLevelToggle(level.level)}
                      className="sr-only"
                    />
                    
                    {/* Custom Checkbox */}
                    <div className={`
                      w-4 h-4 rounded border-2 mr-3 flex items-center justify-center
                      ${isSelected 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Level Badge */}
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mr-3
                      ${level.color}
                    `}>
                      {level.level}
                    </span>
                    
                    {/* Level Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{level.name}</div>
                      <div className="text-xs text-gray-500 truncate">{level.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            
            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {selectedLevels.length === 0 
                    ? 'All levels shown' 
                    : `${selectedLevels.length} of ${levels.length} levels selected`
                  }
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Compact CEFR Filter for smaller spaces
export const CEFRFilterCompact: React.FC<CEFRFilterProps> = ({
  selectedLevels,
  onLevelsChange,
  className = ''
}) => {
  const levels = CEFRService.getAllLevels();
  
  const handleLevelToggle = (level: CEFRLevel) => {
    if (selectedLevels.includes(level)) {
      onLevelsChange(selectedLevels.filter(l => l !== level));
    } else {
      onLevelsChange([...selectedLevels, level]);
    }
  };
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <span className="text-xs font-medium text-gray-600 self-center">Filter:</span>
      {levels.map((level) => {
        const isSelected = selectedLevels.length === 0 || selectedLevels.includes(level.level);
        return (
          <button
            key={level.level}
            onClick={() => handleLevelToggle(level.level)}
            className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-all
              ${isSelected 
                ? level.color 
                : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200'
              }
            `}
          >
            {level.level}
          </button>
        );
      })}
      {selectedLevels.length > 0 && selectedLevels.length < levels.length && (
        <button
          onClick={() => onLevelsChange([])}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
        >
          <X className="w-3 h-3 mr-1" />
          Clear
        </button>
      )}
    </div>
  );
};

export default CEFRFilter;