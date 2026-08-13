import React, { useEffect, useState } from 'react';

interface CountdownOverlayProps {
  initialSeconds?: number;
  onComplete?: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  initialSeconds = 3,
  onComplete
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <p className="text-sm font-bold uppercase tracking-widest text-teal-400">GET READY</p>
        <div className="text-8xl sm:text-9xl font-black text-amber-400 font-mono animate-bounce drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]">
          {seconds > 0 ? seconds : 'GO!'}
        </div>
        <p className="text-slate-400 text-sm">Entering the escape room simulation...</p>
      </div>
    </div>
  );
};
