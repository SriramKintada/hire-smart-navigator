import { Brain, Zap } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-b from-[#181926] to-[#23243a] border-b border-[#23243a] shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Brain className="h-10 w-10 text-blue-400 drop-shadow" />
              <Zap className="h-5 w-5 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent tracking-tight">
                HireAI
              </h1>
              <p className="text-base text-gray-300 font-medium">Elegant, AI-Powered Recruiter Experience</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {/* Future: Add navigation or action buttons here */}
            <div className="text-right">
              <p className="text-sm text-gray-200 font-semibold">Find the perfect candidate</p>
              <p className="text-xs text-gray-400">with intelligent insights</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#23243a]" />
    </header>
  );
};
