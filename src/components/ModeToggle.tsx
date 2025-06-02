import FourPositionToggle from './ui/FourPositionToggle';
import { AppMode } from '@/pages/Index';

interface ModeToggleProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const modeMap: AppMode[] = ['internal', 'external', 'resume', 'analytics'];
const labelMap = ['Recruiter View', 'Talent Search', 'Resume Checker', 'Analytics'];

export const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  // Find the selected index based on mode
  const selectedIdx = modeMap.indexOf(mode);
  return (
    <FourPositionToggle
      onChange={label => {
        const idx = labelMap.indexOf(label);
        if (idx !== -1) onModeChange(modeMap[idx]);
      }}
      initial={selectedIdx}
      labels={labelMap as [string, string, string, string]}
    />
  );
};
