"use client";

import { useState, useEffect } from 'react';
import { useTutorial } from './TutorialProvider';
import dynamic from 'next/dynamic';
import { PlayIcon, DocumentArrowDownIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading Code Editor...</p>
      </div>
    </div>
  ),
});

export function CodeRunner() {
  const { currentExample, currentStepIndex } = useTutorial();
  const [activeTab, setActiveTab] = useState<'solidity' | 'typescript' | 'jsx'>('solidity');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentStep = currentExample?.steps[currentStepIndex];
  const hasCode = currentStep?.code && Object.keys(currentStep.code).length > 0;

  // Update code when step changes
  useEffect(() => {
    if (currentStep?.code) {
      const availableTabs = Object.keys(currentStep.code) as ('solidity' | 'typescript' | 'jsx')[];
      if (availableTabs.length > 0) {
        // Set active tab to first available
        const firstTab = availableTabs[0];
        setActiveTab(firstTab);
        setCode(currentStep.code[firstTab] || '');
      }
    }
  }, [currentStep]);

  // Update code when tab changes
  useEffect(() => {
    if (currentStep?.code?.[activeTab]) {
      setCode(currentStep.code[activeTab] || '');
    }
  }, [activeTab, currentStep]);

  const handleTabChange = (tab: 'solidity' | 'typescript' | 'jsx') => {
    if (currentStep?.code?.[tab]) {
      setActiveTab(tab);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');

    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (activeTab === 'solidity') {
        setOutput(`✅ Solidity compilation successful!

Contract: HelloFHEVM
- Encrypted counter initialized
- FHE operations available: add, subtract, increment, decrement
- Access control configured
- Events configured for transparency

📊 Compilation Stats:
- Contract size: 2.4KB
- Gas estimate: 1,234,567
- Optimization: enabled

🔧 Available Functions:
- getCounter() → euint32
- add(encryptedValue, proof)
- subtract(encryptedValue, proof)  
- increment()
- decrement()
- reset() [owner only]
- grantPermission(address)

Ready for deployment! 🚀`);
      } else if (activeTab === 'typescript' || activeTab === 'jsx') {
        setOutput(`✅ Frontend compilation successful!

🔗 FHEVM Integration:
- Instance created successfully
- Wallet connection configured
- Contract ABI loaded
- Encryption/decryption ready

📱 UI Components:
- Counter display
- Input controls  
- Transaction status
- Error handling

🎨 Styling:
- Tailwind CSS applied
- Responsive design
- Interactive elements
- Loading states

Ready to interact with encrypted contract! 🔐`);
      }
    } catch (error) {
      setOutput(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hello-fhevm-${activeTab}.${activeTab === 'solidity' ? 'sol' : activeTab === 'typescript' ? 'ts' : 'jsx'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!hasCode) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <p className="text-lg font-medium">No Code Available</p>
          <p className="text-sm mt-1">This step doesn't include interactive code</p>
        </div>
      </div>
    );
  }

  const availableTabs = Object.keys(currentStep.code!) as ('solidity' | 'typescript' | 'jsx')[];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-gray-900">Code Runner</h3>
          
          {/* Language Tabs */}
          <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'solidity' ? 'Solidity' : 
                 tab === 'typescript' ? 'TypeScript' : 'React'}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyCode}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copy code"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-600" />
            ) : (
              <ClipboardIcon className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={handleDownloadCode}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
            title="Download code"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1">
          <MonacoEditor
            height="100%"
            language={activeTab === 'solidity' ? 'sol' : activeTab === 'typescript' ? 'typescript' : 'javascript'}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              glyphMargin: false,
              contextmenu: true,
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
              },
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="h-48 border-t">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white text-sm">
              <span className="font-medium">Output</span>
              {isRunning && (
                <div className="flex items-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  <span>Running...</span>
                </div>
              )}
            </div>
            <div className="flex-1 bg-gray-900 text-gray-100 p-4 overflow-y-auto font-mono text-sm">
              <pre className="whitespace-pre-wrap">{output || 'Click "Run" to execute the code...'}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Edit the code above and click "Run" to see it in action. This is a simulated environment for learning purposes.
          </span>
        </div>
      </div>
    </div>
  );
}
