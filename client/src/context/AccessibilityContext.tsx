import React, { createContext, useContext, useEffect, useState } from 'react';

type TextSize = 'small' | 'large' | 'xl';
type ContrastMode = 'standard' | 'high-black' | 'high-white';

interface AccessibilityState {
  textSize: TextSize;
  contrastMode: ContrastMode;
  enableSubtitles: boolean;
  preferEasyRead: boolean;
}

interface AccessibilityContextType extends AccessibilityState {
  setTextSize: (size: TextSize) => void;
  setContrastMode: (mode: ContrastMode) => void;
  setEnableSubtitles: (enable: boolean) => void;
  setPreferEasyRead: (prefer: boolean) => void;
  resetToDefault: () => void;
}

const defaultState: AccessibilityState = {
  textSize: 'small', // which is the standard 16px in this case
  contrastMode: 'standard',
  enableSubtitles: true,
  preferEasyRead: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(() => {
    try {
      const stored = localStorage.getItem('paudit_accessibility');
      return stored ? JSON.parse(stored) : defaultState;
    } catch (e) {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem('paudit_accessibility', JSON.stringify(state));
    
    // Update body classes for text size
    document.body.classList.remove('text-size-small', 'text-size-large', 'text-size-xl');
    document.body.classList.add(`text-size-${state.textSize}`);
    
    // Update body classes for contrast mode
    document.body.classList.remove('high-contrast-black', 'high-contrast-white', 'standard-contrast');
    if (state.contrastMode === 'high-black') {
      document.body.classList.add('high-contrast-black');
    } else if (state.contrastMode === 'high-white') {
      document.body.classList.add('high-contrast-white');
    } else {
      document.body.classList.add('standard-contrast');
    }
  }, [state]);

  const updateState = (updates: Partial<AccessibilityState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetToDefault = () => {
    setState(defaultState);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        setTextSize: (textSize) => updateState({ textSize }),
        setContrastMode: (contrastMode) => updateState({ contrastMode }),
        setEnableSubtitles: (enableSubtitles) => updateState({ enableSubtitles }),
        setPreferEasyRead: (preferEasyRead) => updateState({ preferEasyRead }),
        resetToDefault,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
