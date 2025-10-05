import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, EyeOff, Info, RotateCcw, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { DependencyParser, ParsedSentence, Token } from '../lib/dependencyParser';
import { CEFRBadge } from './CEFRBadge';

interface DependencyVisualizationProps {
  sentence: string;
  className?: string;
  showCEFR?: boolean;
  showPOS?: boolean;
  interactive?: boolean;
}

interface VisualizationSettings {
  showLabels: boolean;
  showPOS: boolean;
  showCEFR: boolean;
  curvedArcs: boolean;
  colorByRelation: boolean;
  fontSize: number;
  arcHeight: number;
}

export const DependencyVisualization: React.FC<DependencyVisualizationProps> = ({
  sentence,
  className = '',
  showCEFR = true,
  showPOS = true,
  interactive = true
}) => {
  const [parsed, setParsed] = useState<ParsedSentence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useApi, setUseApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [hoveredRelation, setHoveredRelation] = useState<string | null>(null);
  const [settings, setSettings] = useState<VisualizationSettings>({
    showLabels: true,
    showPOS: showPOS,
    showCEFR: showCEFR,
    curvedArcs: true,
    colorByRelation: true,
    fontSize: 14,
    arcHeight: 40
  });
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const parseSentence = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const parser = new DependencyParser(useApi);
      const result = await parser.parseSentence(sentence, useApi);
      setParsed(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse sentence');
      console.error('Parsing error:', err);
    } finally {
      setLoading(false);
    }
  }, [sentence, useApi]);

  // Test API connectivity
  const testApiConnection = useCallback(async () => {
    try {
      const { DependencyApiService } = await import('../lib/dependencyApiService');
      const apiService = new DependencyApiService();
      const result = await apiService.testConnection();
      setApiStatus(result.success ? 'connected' : 'disconnected');
    } catch {
      setApiStatus('disconnected');
    }
  }, []);
  
  useEffect(() => {
    if (sentence.trim()) {
      parseSentence();
    }
  }, [sentence, useApi, parseSentence]);

  // Test API connection on mount
  useEffect(() => {
    testApiConnection();
  }, [testApiConnection]);
  
  const handleTokenClick = (token: Token) => {
    if (interactive) {
      setSelectedToken(selectedToken?.id === token.id ? null : token);
    }
  };
  
  const handleRelationHover = (relationId: string | null) => {
    if (interactive) {
      setHoveredRelation(relationId);
    }
  };
  
  const exportSVG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dependency-tree.svg';
      link.click();
      URL.revokeObjectURL(url);
    }
  };
  
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Analyzing sentence structure...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2 text-red-700">
          <Info className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }
  
  if (!parsed) {
    return (
      <div className={`p-8 text-center text-gray-500 ${className}`}>
        Enter a Portuguese sentence to see its dependency structure
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      {interactive && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSettings(s => ({ ...s, showLabels: !s.showLabels }))}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
                  settings.showLabels ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'
                }`}
              >
                {settings.showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>Labels</span>
              </button>
              
              <button
                onClick={() => setSettings(s => ({ ...s, showPOS: !s.showPOS }))}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
                  settings.showPOS ? 'bg-green-100 text-green-700' : 'bg-white text-gray-600'
                }`}
              >
                <span>POS</span>
              </button>
              
              <button
                onClick={() => setSettings(s => ({ ...s, showCEFR: !s.showCEFR }))}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
                  settings.showCEFR ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-600'
                }`}
              >
                <span>CEFR</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useApi}
                  onChange={(e) => setUseApi(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Use API Parsing</span>
                {apiStatus === 'connected' && <span className="text-green-500 text-xs">●</span>}
                {apiStatus === 'disconnected' && <span className="text-red-500 text-xs">●</span>}
                {apiStatus === 'unknown' && <span className="text-gray-400 text-xs">●</span>}
              </label>
              
              <button
                onClick={() => setSettings(s => ({ ...s, fontSize: Math.max(10, s.fontSize - 2) }))}
                className="p-1 bg-white rounded hover:bg-gray-100"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">{settings.fontSize}px</span>
              <button
                onClick={() => setSettings(s => ({ ...s, fontSize: Math.min(20, s.fontSize + 2) }))}
                className="p-1 bg-white rounded hover:bg-gray-100"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={parseSentence}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reparse</span>
            </button>
            
            <button
              onClick={testApiConnection}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <span>Test API</span>
            </button>
            
            <button
              onClick={exportSVG}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Visualization */}
      <div ref={containerRef} className="bg-white border border-gray-200 rounded-lg p-6 overflow-x-auto">
        <DependencyTree
          parsed={parsed}
          settings={settings}
          selectedToken={selectedToken}
          hoveredRelation={hoveredRelation}
          onTokenClick={handleTokenClick}
          onRelationHover={handleRelationHover}
          svgRef={svgRef}
        />
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Complexity</div>
          <div className="text-lg font-bold text-blue-900 capitalize">{parsed.complexity}</div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Tokens</div>
          <div className="text-lg font-bold text-green-900">{parsed.tokens.length}</div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Dependencies</div>
          <div className="text-lg font-bold text-purple-900">{parsed.dependencies.length}</div>
        </div>
        
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-sm text-orange-600 font-medium">Confidence</div>
          <div className="text-lg font-bold text-orange-900">{Math.round(parsed.confidence * 100)}%</div>
        </div>
      </div>
      
      {/* Token Details */}
      {selectedToken && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Token Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Word</div>
              <div className="font-medium flex items-center space-x-2">
                <span>{selectedToken.text}</span>
                {settings.showCEFR && <CEFRBadge word={selectedToken.text} size="sm" />}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Lemma</div>
              <div className="font-medium">{selectedToken.lemma}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Part of Speech</div>
              <div className="font-medium">{selectedToken.posDescription} ({selectedToken.pos})</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Dependency</div>
              <div className="font-medium">{selectedToken.deprelDescription} ({selectedToken.deprel})</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dependency Tree SVG Component
interface DependencyTreeProps {
  parsed: ParsedSentence;
  settings: VisualizationSettings;
  selectedToken: Token | null;
  hoveredRelation: string | null;
  onTokenClick: (token: Token) => void;
  onRelationHover: (relationId: string | null) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

const DependencyTree: React.FC<DependencyTreeProps> = ({
  parsed,
  settings,
  selectedToken,
  hoveredRelation,
  onTokenClick,
  onRelationHover,
  svgRef
}) => {
  const tokenWidth = 120;
  const tokenHeight = 60;
  const tokenSpacing = 20;
  
  const svgWidth = parsed.tokens.length * (tokenWidth + tokenSpacing);
  const svgHeight = 300;
  
  const getTokenX = (index: number) => index * (tokenWidth + tokenSpacing) + tokenWidth / 2;
  const getTokenY = () => svgHeight - 100;
  
  const createArcPath = (x1: number, x2: number, y: number, height: number) => {
    const midX = (x1 + x2) / 2;
    const controlY = y - height;
    
    if (settings.curvedArcs) {
      return `M ${x1} ${y} Q ${midX} ${controlY} ${x2} ${y}`;
    } else {
      return `M ${x1} ${y} L ${midX} ${controlY} L ${x2} ${y}`;
    }
  };
  
  return (
    <svg
      ref={svgRef}
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full h-auto"
    >
      {/* Dependencies (arcs) */}
      {parsed.dependencies.map((dep, index) => {
        const headIndex = parsed.tokens.findIndex(t => t.id === dep.head.id);
        const depIndex = parsed.tokens.findIndex(t => t.id === dep.dependent.id);
        
        if (headIndex === -1 || depIndex === -1) return null;
        
        const x1 = getTokenX(headIndex);
        const x2 = getTokenX(depIndex);
        const y = getTokenY();
        const height = settings.arcHeight + (index % 3) * 20;
        
        const isHighlighted = hoveredRelation === dep.id || 
                            selectedToken?.id === dep.head.id || 
                            selectedToken?.id === dep.dependent.id;
        
        return (
          <g key={dep.id}>
            {/* Arc */}
            <path
              d={createArcPath(x1, x2, y, height)}
              fill="none"
              stroke={settings.colorByRelation ? dep.color : '#6b7280'}
              strokeWidth={isHighlighted ? 3 : 2}
              opacity={isHighlighted ? 1 : 0.7}
              className="cursor-pointer"
              onMouseEnter={() => onRelationHover(dep.id)}
              onMouseLeave={() => onRelationHover(null)}
            />
            
            {/* Arrow */}
            <polygon
              points={`${x2-5},${y-5} ${x2+5},${y-5} ${x2},${y}`}
              fill={settings.colorByRelation ? dep.color : '#6b7280'}
              opacity={isHighlighted ? 1 : 0.7}
            />
            
            {/* Label */}
            {settings.showLabels && (
              <text
                x={(x1 + x2) / 2}
                y={y - height + 15}
                textAnchor="middle"
                fontSize={settings.fontSize - 2}
                fill={settings.colorByRelation ? dep.color : '#374151'}
                className="font-medium"
              >
                {dep.relation}
              </text>
            )}
          </g>
        );
      })}
      
      {/* Tokens */}
      {parsed.tokens.map((token, index) => {
        const x = getTokenX(index);
        const y = getTokenY();
        const isSelected = selectedToken?.id === token.id;
        const isRoot = token.deprel === 'root';
        
        return (
          <g key={token.id}>
            {/* Token background */}
            <rect
              x={x - tokenWidth / 2}
              y={y - tokenHeight / 2}
              width={tokenWidth}
              height={tokenHeight}
              rx={8}
              fill={isSelected ? '#dbeafe' : isRoot ? '#fef3c7' : '#f9fafb'}
              stroke={isSelected ? '#3b82f6' : isRoot ? '#f59e0b' : '#e5e7eb'}
              strokeWidth={isSelected ? 2 : 1}
              className="cursor-pointer"
              onClick={() => onTokenClick(token)}
            />
            
            {/* Token text */}
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              fontSize={settings.fontSize}
              fill="#111827"
              className="font-medium cursor-pointer"
              onClick={() => onTokenClick(token)}
            >
              {token.text}
            </text>
            
            {/* POS tag */}
            {settings.showPOS && (
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize={settings.fontSize - 4}
                fill="#6b7280"
                className="cursor-pointer"
                onClick={() => onTokenClick(token)}
              >
                {token.pos}
              </text>
            )}
            
            {/* CEFR badge */}
            {settings.showCEFR && (
              <foreignObject
                x={x - 15}
                y={y + 15}
                width={30}
                height={20}
              >
                <CEFRBadge word={token.text} size="sm" showTooltip={false} />
              </foreignObject>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default DependencyVisualization;