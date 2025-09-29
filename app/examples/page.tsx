import Link from 'next/link';
import { ArrowRightIcon, ClockIcon, UserGroupIcon, TrophyIcon } from '@heroicons/react/24/outline';

const examples = [
  {
    id: 'hello-fhevm',
    title: 'Hello FHEVM Counter',
    description: 'Your first encrypted smart contract with basic arithmetic operations on private data.',
    difficulty: 'Beginner',
    duration: '30 minutes',
    features: [
      'Encrypted state storage',
      'Private arithmetic operations', 
      'Access control patterns',
      'Client-side encryption'
    ],
    color: 'green',
    href: '/tutorial?example=hello-fhevm'
  },
  {
    id: 'private-voting',
    title: 'Private Voting System',
    description: 'Build a confidential voting dApp where individual votes remain secret until tallied.',
    difficulty: 'Intermediate',
    duration: '45 minutes',
    features: [
      'Encrypted vote casting',
      'Private vote tallying',
      'Time-based voting periods',
      'Result revelation'
    ],
    color: 'yellow',
    href: '/tutorial?example=private-voting'
  },
  {
    id: 'secret-auction',
    title: 'Secret Auction House',
    description: 'Create a sealed-bid auction where bids remain private until the auction ends.',
    difficulty: 'Advanced', 
    duration: '60 minutes',
    features: [
      'Sealed bid submission',
      'Private bid comparison',
      'Winner determination',
      'Automatic refunds'
    ],
    color: 'red',
    href: '/tutorial?example=secret-auction'
  }
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              FHEVM Examples
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore hands-on examples that demonstrate the power of Fully Homomorphic Encryption 
              on Ethereum. Each example includes complete source code and step-by-step explanations.
            </p>
          </div>
        </div>
      </div>

      {/* Examples Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example) => (
            <div key={example.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Header */}
              <div className={`p-6 ${
                example.color === 'green' ? 'bg-green-50 border-b border-green-100' :
                example.color === 'yellow' ? 'bg-yellow-50 border-b border-yellow-100' :
                'bg-red-50 border-b border-red-100'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    example.color === 'green' ? 'bg-green-100 text-green-700' :
                    example.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {example.difficulty}
                  </span>
                  <div className="flex items-center text-gray-600 text-sm">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {example.duration}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {example.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {example.description}
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">What You'll Learn:</h4>
                <ul className="space-y-2 mb-6">
                  {example.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={example.href}
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                >
                  Start Tutorial
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Developers Learning</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Completed Projects</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">3</h3>
              <p className="text-gray-600">Interactive Tutorials</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Begin your journey into privacy-preserving smart contracts with our beginner-friendly tutorial.
          </p>
          <Link
            href="/tutorial?example=hello-fhevm"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold text-lg"
          >
            Start Hello FHEVM Tutorial
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
