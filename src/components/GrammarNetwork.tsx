'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Network, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Settings,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  GrammarNetworkService, 
  GrammarNetwork, 
  GrammarNode, 
  GrammarEdge,
  GRAMMAR_CATEGORIES 
} from '@/lib/grammarNetworkService';

interface GrammarNetworkProps {
  word: string;
  depth?: number;
  width?: number;
  height?: number;
  interactive?: boolean;
  showControls?: boolean;
  showLegend?: boolean;
  className?: string;
}

interface NetworkControls {
  showLabels: boolean;
  showCategories: boolean;
  showRules: boolean;
  nodeSize: number;
  edgeWidth: number;
  zoom: number;
}

export default function GrammarNetworkVisualization({
  word,
  depth = 2,
  width = 800,
  height = 600,
  interactive = true,
  showControls = true,
  showLegend = true,
  className = ''
}: GrammarNetworkProps) {
  const [network, setNetwork] = useState<GrammarNetwork | null>(null);
  const [selectedNode, setSelectedNode] = useState<GrammarNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GrammarEdge | null>(null);
  const [controls, setControls] = useState<NetworkControls>({
    showLabels: true,
    showCategories: true,
    showRules: true,
    nodeSize: 1,
    edgeWidth: 1,
    zoom: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const grammarService = GrammarNetworkService.getInstance();
  
  // Generate network when word changes
  useEffect(() => {
    if (word.trim()) {
      setIsLoading(true);
      try {
        const generatedNetwork = grammarService.generateNetwork(word.trim(), depth);
        setNetwork(generatedNetwork);
      } catch (error) {
        console.error('Error generating grammar network:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [word, depth]);
  
  // Handle node click
  const handleNodeClick = useCallback((node: GrammarNode) => {
    if (!interactive) return;
    setSelectedNode(selectedNode?.id === node.id ? null : node);
    setSelectedEdge(null);
  }, [selectedNode, interactive]);
  
  // Handle edge click
  const handleEdgeClick = useCallback((edge: GrammarEdge) => {
    if (!interactive) return;
    setSelectedEdge(selectedEdge?.id === edge.id ? null : edge);
    setSelectedNode(null);
  }, [selectedEdge, interactive]);
  
  // Export network as SVG
  const exportSVG = useCallback(() => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `grammar-network-${word}.svg`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [word]);
  
  // Reset view
  const resetView = useCallback(() => {
    setControls(prev => ({ ...prev, zoom: 1 }));
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);
  
  // Get node color based on category
  const getNodeColor = (node: GrammarNode): string => {
    if (node.type === 'rule') return '#6B7280';
    return grammarService.getCategoryColor(node.category);
  };
  
  // Get node size based on properties
  const getNodeSize = (node: GrammarNode): number => {
    const baseSize = node.type === 'rule' ? 8 : 12;
    const sizeMultiplier = controls.nodeSize;
    const importanceMultiplier = node.level === 0 ? 1.5 : 1;
    return baseSize * sizeMultiplier * importanceMultiplier;
  };
  
  // Get edge color based on type
  const getEdgeColor = (edge: GrammarEdge): string => {
    const colors = {
      'synonym': '#10B981',
      'antonym': '#EF4444',
      'inflection': '#3B82F6',
      'derivation': '#8B5CF6',
      'collocation': '#F59E0B',
      'syntactic': '#6B7280',
      'semantic': '#EC4899'
    };
    return colors[edge.type as keyof typeof colors] || '#6B7280';
  };
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-white rounded-lg border ${className}`} 
           style={{ width, height }}>
        <div className="text-center">
          <Network className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Gerando rede gramatical...</p>
        </div>
      </div>
    );
  }
  
  if (!network) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg border ${className}`} 
           style={{ width, height }}>
        <div className="text-center text-gray-500">
          <Network className="w-8 h-8 mx-auto mb-2" />
          <p>Digite uma palavra para gerar a rede gramatical</p>
        </div>
      </div>
    );
  }
  
  const viewBox = `${-width/2} ${-height/2} ${width} ${height}`;
  
  return (
    <div className={`bg-white rounded-lg border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Rede Gramatical: <span className="text-purple-600">{word}</span>
            </h3>
          </div>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setControls(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.2, 3) }))}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setControls(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.2, 0.5) }))}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <button
                onClick={resetView}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={exportSVG}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Export SVG"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Network Stats */}
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
          <span>{network.metadata.totalNodes} nós</span>
          <span>{network.metadata.totalEdges} conexões</span>
          <span className="capitalize">Complexidade: {network.metadata.complexity}</span>
        </div>
      </div>
      
      <div className="flex">
        {/* Main Visualization */}
        <div className="flex-1" style={{ width: showLegend ? width - 250 : width }}>
          <svg
            ref={svgRef}
            width={showLegend ? width - 250 : width}
            height={height}
            viewBox={viewBox}
            className="border-r border-gray-200"
          >
            <defs>
              {/* Arrow markers for directed edges */}
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6B7280"
                />
              </marker>
            </defs>
            
            <g transform={`scale(${controls.zoom})`}>
              {/* Render edges */}
              {network.edges.map(edge => {
                if (!controls.showRules && edge.type === 'syntactic') return null;
                
                const sourceNode = network.nodes.find(n => n.id === edge.source);
                const targetNode = network.nodes.find(n => n.id === edge.target);
                
                if (!sourceNode || !targetNode) return null;
                
                const isSelected = selectedEdge?.id === edge.id;
                
                return (
                  <g key={edge.id}>
                    <line
                      x1={sourceNode.position.x}
                      y1={sourceNode.position.y}
                      x2={targetNode.position.x}
                      y2={targetNode.position.y}
                      stroke={getEdgeColor(edge)}
                      strokeWidth={controls.edgeWidth * (isSelected ? 3 : edge.strength * 2)}
                      strokeOpacity={isSelected ? 1 : 0.6}
                      markerEnd={edge.bidirectional ? undefined : "url(#arrowhead)"}
                      className={interactive ? "cursor-pointer" : ""}
                      onClick={() => handleEdgeClick(edge)}
                    />
                    
                    {controls.showLabels && (
                      <text
                        x={(sourceNode.position.x + targetNode.position.x) / 2}
                        y={(sourceNode.position.y + targetNode.position.y) / 2}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6B7280"
                        className="pointer-events-none"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
              
              {/* Render nodes */}
              {network.nodes.map(node => {
                if (!controls.showRules && node.type === 'rule') return null;
                
                const isSelected = selectedNode?.id === node.id;
                const isCenterNode = node.id === network.centerNode;
                const nodeSize = getNodeSize(node);
                
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.position.x}
                      cy={node.position.y}
                      r={nodeSize}
                      fill={getNodeColor(node)}
                      stroke={isSelected ? "#1F2937" : isCenterNode ? "#374151" : "white"}
                      strokeWidth={isSelected ? 3 : isCenterNode ? 2 : 1}
                      className={interactive ? "cursor-pointer hover:opacity-80" : ""}
                      onClick={() => handleNodeClick(node)}
                    />
                    
                    {controls.showLabels && (
                      <text
                        x={node.position.x}
                        y={node.position.y + nodeSize + 12}
                        textAnchor="middle"
                        fontSize={isCenterNode ? "12" : "10"}
                        fontWeight={isCenterNode ? "bold" : "normal"}
                        fill="#374151"
                        className="pointer-events-none"
                      >
                        {node.word}
                      </text>
                    )}
                    
                    {controls.showCategories && node.type !== 'rule' && (
                      <text
                        x={node.position.x}
                        y={node.position.y + nodeSize + 24}
                        textAnchor="middle"
                        fontSize="8"
                        fill="#6B7280"
                        className="pointer-events-none"
                      >
                        {node.category}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        
        {/* Legend and Controls */}
        {showLegend && (
          <div className="w-64 bg-gray-50 p-4 space-y-4 overflow-y-auto" style={{ height }}>
            {/* Controls */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Settings className="w-4 h-4 mr-1" />
                Controles
              </h4>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={controls.showLabels}
                    onChange={(e) => setControls(prev => ({ ...prev, showLabels: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Mostrar rótulos</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={controls.showCategories}
                    onChange={(e) => setControls(prev => ({ ...prev, showCategories: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Mostrar categorias</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={controls.showRules}
                    onChange={(e) => setControls(prev => ({ ...prev, showRules: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Mostrar regras</span>
                </label>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tamanho dos nós</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={controls.nodeSize}
                    onChange={(e) => setControls(prev => ({ ...prev, nodeSize: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Espessura das conexões</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={controls.edgeWidth}
                    onChange={(e) => setControls(prev => ({ ...prev, edgeWidth: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Categories Legend */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Categorias Gramaticais</h4>
              <div className="space-y-1">
                {Object.entries(GRAMMAR_CATEGORIES).map(([key, category]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-xs text-gray-700">{category.name}</span>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="text-xs text-gray-700">Regras</span>
                </div>
              </div>
            </div>
            
            {/* Selected Node/Edge Info */}
            {(selectedNode || selectedEdge) && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Informações
                </h4>
                
                {selectedNode && (
                  <div className="bg-white p-3 rounded border text-sm">
                    <div className="font-medium text-gray-900 mb-1">{selectedNode.word}</div>
                    <div className="text-gray-600 space-y-1">
                      <div>Tipo: {selectedNode.type}</div>
                      <div>Categoria: {selectedNode.category}</div>
                      <div>Nível: {selectedNode.level}</div>
                      {selectedNode.properties.pos && (
                        <div>Classe: {selectedNode.properties.pos}</div>
                      )}
                      {selectedNode.properties.gender && (
                        <div>Gênero: {selectedNode.properties.gender}</div>
                      )}
                      {selectedNode.properties.number && (
                        <div>Número: {selectedNode.properties.number}</div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedEdge && (
                  <div className="bg-white p-3 rounded border text-sm">
                    <div className="font-medium text-gray-900 mb-1">{selectedEdge.label}</div>
                    <div className="text-gray-600 space-y-1">
                      <div>Tipo: {selectedEdge.type}</div>
                      <div>Força: {(selectedEdge.strength * 100).toFixed(0)}%</div>
                      <div>Bidirecional: {selectedEdge.bidirectional ? 'Sim' : 'Não'}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}