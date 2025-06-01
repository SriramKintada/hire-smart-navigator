import ThreePositionToggle from './ui/ThreePositionToggle';
import { AppMode } from '@/pages/Index';

interface ModeToggleProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const modeMap: AppMode[] = ['internal', 'external', 'resume'];
const labelMap = ['Recruiter View', 'Talent Search', 'Resume Checker'];

export const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  // Find the selected index based on mode
  const selectedIdx = modeMap.indexOf(mode);
  return (
    <ThreePositionToggle
      onChange={label => {
        const idx = labelMap.indexOf(label);
        if (idx !== -1) onModeChange(modeMap[idx]);
      }}
      initial={selectedIdx}
      labels={labelMap}
    />
  );
};
