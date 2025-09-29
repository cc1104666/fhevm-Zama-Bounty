"use client";

import { useTutorial } from './TutorialProvider';
import { CheckCircleIcon, PlayCircleIcon, ClockIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export function TutorialSidebar() {
  const { currentExample, currentStepIndex, examples, setCurrentExample, goToStep } = useTutorial();

  if (!currentExample) return null;

  const completedSteps = currentExample.steps.filter(step => step.completed).length;
  const totalSteps = currentExample.steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <aside className="w-80 bg-white border-r shadow-sm overflow-y-auto h-screen">
      <div className="p-6">
        {/* Tutorial Header */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <BookOpenIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Tutorial</h3>
          </div>
          <h4 className="font-medium text-gray-800 mb-2">{currentExample.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{currentExample.description}</p>
          
          <div className="flex items-center space-x-2 text-xs">
            <span className={`px-2 py-1 rounded-full font-medium ${
              currentExample.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
              currentExample.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentExample.difficulty}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{currentExample.estimatedTime}</span>
          </div>
        </div>

        {/* Example Selector */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Choose Tutorial
          </h3>
          <div className="space-y-2">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setCurrentExample(example)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  currentExample.id === example.id
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm">{example.title}</div>
                <div className="text-xs text-gray-600 mt-1 line-clamp-2">{example.description}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    example.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    example.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {example.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">
                    {example.steps.length} steps
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Progress
            </h3>
            <span className="text-xs text-gray-500">
              {completedSteps}/{totalSteps}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="progress-bar mb-4">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="space-y-1">
            {currentExample.steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = step.completed;
              const isAccessible = index <= currentStepIndex || isCompleted;

              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && goToStep(index)}
                  disabled={!isAccessible}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-100 border-indigo-200 text-indigo-900 border'
                      : isCompleted
                      ? 'bg-green-50 border-green-200 text-green-900 border'
                      : isAccessible
                      ? 'hover:bg-gray-50 border border-gray-200 text-gray-900'
                      : 'opacity-50 cursor-not-allowed border border-gray-100 text-gray-500'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-0.5">
                      {isCompleted ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : isActive ? (
                        <PlayCircleIcon className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm leading-tight">{step.title}</div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{step.description}</div>
                      {step.interactive && (
                        <div className="flex items-center mt-2">
                          <svg className="w-3 h-3 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <span className="text-xs text-blue-600 font-medium">Interactive</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Achievement Section */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h4 className="font-semibold text-gray-800">Your Progress</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {completedSteps === 0 ? 'Just getting started!' :
             completedSteps === totalSteps ? 'Tutorial completed! 🎉' :
             `${completedSteps} of ${totalSteps} steps completed`}
          </p>
          
          {progressPercentage > 0 && (
            <div className="text-xs text-gray-500">
              {Math.round(progressPercentage)}% complete
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
