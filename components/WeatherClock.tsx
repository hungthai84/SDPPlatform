
import React, { useState, useEffect } from 'react';
import { SunIcon, MapPinIcon } from './icons';
import { useLanguage } from './LanguageContext';

const WeatherClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationName] = useState<string>('Hà Nội, Việt Nam');
  const { language } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString(language, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString(language, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="flex items-center gap-4 text-sm text-[--color-text-secondary]">
      <div className="flex items-center gap-2">
        <SunIcon className="w-6 h-6 text-yellow-500" />
        <span className="font-medium">25°C</span>
      </div>
       <div className="h-8 w-px bg-[--color-border-secondary]"></div>
      <div className="text-right">
        <div className="font-semibold text-[--color-text-primary]">{formattedTime}</div>
        <div className="text-xs text-[--color-text-secondary] flex items-center justify-end gap-1.5">
            <span>{formattedDate}</span>
            <span className="opacity-50" aria-hidden="true">&bull;</span>
            <div 
                className="flex items-center gap-1 text-slate-500" 
                title={locationName}
            >
                <MapPinIcon className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[150px]">{locationName}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherClock;
