import Link from 'next/link';
import { ArrowRightIcon, BookOpenIcon, CodeBracketIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Hello{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FHEVM
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Learn Fully Homomorphic Encryption on Ethereum with the most beginner-friendly interactive tutorial
            </p>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              Build your first privacy-preserving dApp that performs encrypted computations on-chain 
              without ever revealing your data
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/tutorial?example=hello-fhevm" 
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Learning
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
              
              <Link 
                href="/examples" 
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                View Examples
                <CodeBracketIcon className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-200 rounded-full opacity-20 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Learn FHEVM?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              FHEVM enables unprecedented privacy on blockchain by allowing computations on encrypted data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Interactive Learning
              </h3>
              <p className="text-gray-600">
                Step-by-step guided tutorial with hands-on coding exercises and real-time feedback
              </p>
            </div>

            <div className="card text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CodeBracketIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Live Code Editor
              </h3>
              <p className="text-gray-600">
                Edit and run Solidity and TypeScript code directly in your browser with instant compilation
              </p>
            </div>

            <div className="card text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <RocketLaunchIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                One-Click Deploy
              </h3>
              <p className="text-gray-600">
                Deploy your contracts to local or test networks with a single click and see them in action
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Learning Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From zero to FHEVM hero in progressive, hands-on steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Hello FHEVM Counter</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Build your first encrypted counter with basic FHE operations
              </p>
              <div className="flex items-center text-sm text-green-600">
                <span className="bg-green-100 px-2 py-1 rounded-full">Beginner</span>
                <span className="ml-2">~30 minutes</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Private Voting</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Create a confidential voting system with encrypted ballots
              </p>
              <div className="flex items-center text-sm text-yellow-600">
                <span className="bg-yellow-100 px-2 py-1 rounded-full">Intermediate</span>
                <span className="ml-2">~45 minutes</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Secret Auction</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Build a sealed-bid auction with private bid comparisons
              </p>
              <div className="flex items-center text-sm text-red-600">
                <span className="bg-red-100 px-2 py-1 rounded-full">Advanced</span>
                <span className="ml-2">~60 minutes</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/tutorial?example=hello-fhevm" 
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build the Future of Privacy?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers learning to build privacy-preserving applications with FHEVM
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tutorial?example=hello-fhevm" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Tutorial
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
            
            <a 
              href="https://docs.zama.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border border-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              View Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Built with ❤️ for the Zama Community
            </p>
            <p className="text-sm text-gray-500">
              This tutorial is part of the Zama Bounty Program Season 10
            </p>
            <div className="flex justify-center space-x-6 mt-6">
              <a href="https://zama.ai" className="text-gray-400 hover:text-white transition-colors">
                Zama.ai
              </a>
              <a href="https://docs.zama.ai" className="text-gray-400 hover:text-white transition-colors">
                Documentation
              </a>
              <a href="https://discord.gg/zama" className="text-gray-400 hover:text-white transition-colors">
                Discord
              </a>
              <a href="https://github.com/zama-ai" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
