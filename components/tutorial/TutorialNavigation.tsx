"use client";

import { useTutorial } from './TutorialProvider';
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function TutorialNavigation() {
  const { currentExample, currentStepIndex, nextStep, prevStep } = useTutorial();

  if (!currentExample) return null;

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === currentExample.steps.length - 1;
  const currentStep = currentExample.steps[currentStepIndex];

  return (
    <div className="border-t bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Previous Step */}
        <div className="flex-1">
          {!isFirstStep ? (
            <button
              onClick={prevStep}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          )}
        </div>

        {/* Current Step Info */}
        <div className="flex-1 text-center">
          <div className="text-sm text-gray-600">
            <span className="hidden sm:inline">{currentStep.title}</span>
            <div className="flex items-center justify-center space-x-1 mt-1">
              {currentExample.steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentStepIndex
                      ? 'bg-blue-600'
                      : index < currentStepIndex
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Next Step */}
        <div className="flex-1 flex justify-end">
          {!isLastStep ? (
            <button
              onClick={nextStep}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">🎉 Tutorial Complete!</div>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                <span>Finish</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
