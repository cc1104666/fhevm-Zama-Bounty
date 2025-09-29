"use client";

import { useTutorial } from './TutorialProvider';
import { TutorialSidebar } from './TutorialSidebar';
import { TutorialContent } from './TutorialContent';
import { TutorialNavigation } from './TutorialNavigation';
import { CodeRunner } from './CodeRunner';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function TutorialLayout() {
  const { currentExample, currentStepIndex } = useTutorial();
  const [showCodeRunner, setShowCodeRunner] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentExample) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Hello FHEVM Tutorial</h1>
          <p className="text-gray-600">Loading tutorial content...</p>
        </div>
      </div>
    );
  }

  const currentStep = currentExample.steps[currentStepIndex];
  const hasCode = currentStep?.code && Object.keys(currentStep.code).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>

              <h1 className="text-2xl font-bold text-gray-900">
                Hello FHEVM Tutorial
              </h1>
              
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentExample.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  currentExample.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentExample.difficulty}
                </span>
                <span>
                  Step {currentStepIndex + 1} of {currentExample.steps.length}
                </span>
                <span>•</span>
                <span>{currentExample.estimatedTime}</span>
              </div>
            </div>
            
            {hasCode && (
              <button
                onClick={() => setShowCodeRunner(!showCodeRunner)}
                className="hidden md:inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                {showCodeRunner ? 'Hide' : 'Show'} Code Runner
              </button>
            )}
          </div>

          {/* Mobile progress bar */}
          <div className="mt-4 lg:hidden">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{currentStep.title}</span>
              <span>{currentStepIndex + 1}/{currentExample.steps.length}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{
                  width: `${((currentStepIndex + 1) / currentExample.steps.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}>
          <TutorialSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex min-h-0">
          {/* Tutorial Content */}
          <div className={`${
            showCodeRunner && hasCode ? 'lg:w-1/2' : 'w-full'
          } transition-all duration-300 flex flex-col min-h-0`}>
            <div className="flex-1 overflow-hidden">
              <TutorialContent />
            </div>
            <TutorialNavigation />
          </div>

          {/* Code Runner */}
          {showCodeRunner && hasCode && (
            <div className="hidden lg:block lg:w-1/2 border-l bg-white">
              <CodeRunner />
            </div>
          )}
        </main>
      </div>

      {/* Mobile code runner modal */}
      {showCodeRunner && hasCode && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Code Runner</h2>
            <button
              onClick={() => setShowCodeRunner(false)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeRunner />
          </div>
        </div>
      )}
    </div>
  );
}
