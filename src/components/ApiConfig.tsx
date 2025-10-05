'use client';

import React, { useState, useEffect } from 'react';
import { API_PROVIDERS, ApiConfig as ApiConfigType, DependencyApiService } from '../lib/dependencyApiService';

interface ApiConfigProps {
  onConfigChange?: (config: ApiConfigType) => void;
  className?: string;
}

interface ProviderStatus {
  name: string;
  status: 'unknown' | 'connected' | 'disconnected' | 'testing';
  latency?: number;
  error?: string;
}

export function ApiConfig({ onConfigChange, className = '' }: ApiConfigProps) {
  const [config, setConfig] = useState<ApiConfigType>({
    baseUrl: API_PROVIDERS.LOCAL_MOCK.baseUrl,
    timeout: 10000,
    retries: 3
  });
  
  const [apiKey, setApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('LOCAL_MOCK');
  const [providerStatuses, setProviderStatuses] = useState<Record<string, ProviderStatus>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize provider statuses
  useEffect(() => {
    const statuses: Record<string, ProviderStatus> = {};
    Object.entries(API_PROVIDERS).forEach(([key, provider]) => {
      statuses[key] = {
        name: provider.name,
        status: 'unknown'
      };
    });
    setProviderStatuses(statuses);
  }, []);

  // Test connection to a specific provider
  const testProvider = async (providerKey: string) => {
    const provider = API_PROVIDERS[providerKey as keyof typeof API_PROVIDERS];
    if (!provider) return;

    setProviderStatuses(prev => ({
      ...prev,
      [providerKey]: { ...prev[providerKey], status: 'testing' }
    }));

    try {
      const startTime = Date.now();
      const testConfig: ApiConfigType = {
        baseUrl: provider.baseUrl,
        apiKey: apiKey || undefined,
        timeout: config.timeout,
        retries: 1
      };

      const apiService = new DependencyApiService(testConfig);
      const result = await apiService.testConnection();
      const latency = Date.now() - startTime;

      setProviderStatuses(prev => ({
        ...prev,
        [providerKey]: {
          ...prev[providerKey],
          status: result.success ? 'connected' : 'disconnected',
          latency: result.success ? latency : undefined,
          error: result.error
        }
      }));
    } catch (error) {
      setProviderStatuses(prev => ({
        ...prev,
        [providerKey]: {
          ...prev[providerKey],
          status: 'disconnected',
          error: error instanceof Error ? error.message : 'Connection failed'
        }
      }));
    }
  };

  // Test all providers
  const testAllProviders = async () => {
    const providerKeys = Object.keys(API_PROVIDERS);
    for (const key of providerKeys) {
      await testProvider(key);
      // Small delay between tests to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  // Update configuration
  const updateConfig = (updates: Partial<ApiConfigType>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  // Select provider
  const selectProvider = (providerKey: string) => {
    const provider = API_PROVIDERS[providerKey as keyof typeof API_PROVIDERS];
    if (!provider) return;

    setSelectedProvider(providerKey);
    updateConfig({
      baseUrl: provider.baseUrl,
      apiKey: apiKey || undefined
    });
  };

  // Get status indicator
  const getStatusIndicator = (status: ProviderStatus['status']) => {
    switch (status) {
      case 'connected':
        return <span className="w-2 h-2 bg-green-500 rounded-full"></span>;
      case 'disconnected':
        return <span className="w-2 h-2 bg-red-500 rounded-full"></span>;
      case 'testing':
        return <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>;
      default:
        return <span className="w-2 h-2 bg-gray-400 rounded-full"></span>;
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-gray-900">API Configuration</h3>
          {providerStatuses[selectedProvider] && (
            <div className="flex items-center gap-2">
              {getStatusIndicator(providerStatuses[selectedProvider].status)}
              <span className="text-sm text-gray-600">
                {API_PROVIDERS[selectedProvider as keyof typeof API_PROVIDERS]?.name}
              </span>
            </div>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Provider
            </label>
            <div className="space-y-2">
              {Object.entries(API_PROVIDERS).map(([key, provider]) => {
                const status = providerStatuses[key];
                return (
                  <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id={key}
                        name="provider"
                        checked={selectedProvider === key}
                        onChange={() => selectProvider(key)}
                        className="text-blue-600"
                      />
                      <label htmlFor={key} className="flex-1 cursor-pointer">
                        <div className="font-medium text-gray-900">{provider.name}</div>
                        <div className="text-sm text-gray-500">{provider.baseUrl}</div>
                        <div className="text-xs text-gray-400">
                          Features: {provider.features.join(', ')}
                        </div>
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {status && (
                        <div className="flex items-center gap-2">
                          {getStatusIndicator(status.status)}
                          {status.latency && (
                            <span className="text-xs text-gray-500">{status.latency}ms</span>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => testProvider(key)}
                        disabled={status?.status === 'testing'}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              API Key (optional)
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                updateConfig({ apiKey: e.target.value || undefined });
              }}
              placeholder="Enter API key if required"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 mb-2">
                Timeout (ms)
              </label>
              <input
                type="number"
                id="timeout"
                value={config.timeout}
                onChange={(e) => updateConfig({ timeout: parseInt(e.target.value) || 10000 })}
                min="1000"
                max="60000"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="retries" className="block text-sm font-medium text-gray-700 mb-2">
                Retries
              </label>
              <input
                type="number"
                id="retries"
                value={config.retries}
                onChange={(e) => updateConfig({ retries: parseInt(e.target.value) || 3 })}
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={testAllProviders}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Test All Providers
            </button>
            
            <button
              onClick={() => {
                setProviderStatuses(prev => {
                  const updated = { ...prev };
                  Object.keys(updated).forEach(key => {
                    updated[key] = { ...updated[key], status: 'unknown', latency: undefined, error: undefined };
                  });
                  return updated;
                });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
            >
              Reset Status
            </button>
          </div>

          {/* Status Summary */}
          {Object.values(providerStatuses).some(s => s.error) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <h4 className="text-sm font-medium text-red-800 mb-2">Connection Errors:</h4>
              <div className="space-y-1">
                {Object.entries(providerStatuses)
                  .filter(([, status]) => status.error)
                  .map(([key, status]) => (
                    <div key={key} className="text-sm text-red-700">
                      <strong>{status.name}:</strong> {status.error}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ApiConfig;