
import { FileText, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AppMode } from '@/pages/Index';

interface ModeToggleProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <Card className="p-2 bg-white/60 backdrop-blur-sm border-2">
      <div className="flex rounded-lg overflow-hidden">
        <button
          onClick={() => onModeChange('internal')}
          className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-200 ${
            mode === 'internal'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-transparent text-gray-600 hover:bg-blue-50'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>Internal Mode</span>
        </button>
        
        <button
          onClick={() => onModeChange('external')}
          className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-200 ${
            mode === 'external'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-transparent text-gray-600 hover:bg-blue-50'
          }`}
        >
          <Globe className="h-5 w-5" />
          <span>External Mode</span>
        </button>
      </div>
    </Card>
  );
};
