"use client";

import { useTutorial } from './TutorialProvider';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';

export function TutorialContent() {
  const { currentExample, currentStepIndex, markStepCompleted } = useTutorial();

  if (!currentExample) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  const currentStep = currentExample.steps[currentStepIndex];

  const handleMarkCompleted = () => {
    markStepCompleted(currentStep.id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          {/* Step Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  currentStep.completed ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {currentStep.completed ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <span>{currentStepIndex + 1}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {currentStep.title}
                  </h1>
                  <p className="text-gray-600 mt-1">{currentStep.description}</p>
                </div>
              </div>

              {!currentStep.completed && (
                <button
                  onClick={handleMarkCompleted}
                  className="hidden sm:inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Mark Complete
                </button>
              )}
            </div>

            {/* Step indicators */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Step {currentStepIndex + 1} of {currentExample.steps.length}</span>
              {currentStep.interactive && (
                <>
                  <span>•</span>
                  <div className="flex items-center text-blue-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span className="font-medium">Interactive</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  
                  if (!inline && match) {
                    return (
                      <div className="my-6">
                        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
                          <span className="text-gray-300 text-sm font-medium">
                            {language.toUpperCase()}
                          </span>
                          <button
                            onClick={() => navigator.clipboard.writeText(String(children))}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Copy code"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={language}
                          PreTag="div"
                          className="rounded-t-none"
                          customStyle={{
                            margin: 0,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    );
                  } else {
                    return (
                      <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }
                },
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50 py-2 rounded-r">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {currentStep.content}
            </ReactMarkdown>
          </div>

          {/* Tips section */}
          {currentStep.interactive && (
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <LightBulbIcon className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Interactive Step</h3>
                  <p className="text-yellow-700 text-sm">
                    This step includes interactive code that you can edit and run. 
                    Use the code runner on the right (or click "Show Code Runner" on mobile) 
                    to experiment with the code and see it in action!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile mark complete button */}
          {!currentStep.completed && (
            <div className="sm:hidden mt-8">
              <button
                onClick={handleMarkCompleted}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Mark Step Complete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
