'use client';

import { createContext, useContext, useReducer, ReactNode, useState } from 'react';
import { Report, Message } from '@/types';

interface AppState {
  reports: Report[];
  selectedReportId: string;
  sidebarMinimized: boolean;
  isMobileSidebarOpen: boolean;
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  logout: () => void;
}

type AppAction =
  | { type: 'SELECT_REPORT'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_MOBILE_SIDEBAR' }
  | { type: 'ADD_MESSAGE'; payload: { reportId: string; message: Message } }
  | { type: 'UPDATE_REPORT'; payload: { reportId: string; updates: Partial<Report> } }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  reports: [],
  selectedReportId: '',
  sidebarMinimized: false,
  isMobileSidebarOpen: false,
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_REPORT':
      return { ...state, selectedReportId: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarMinimized: !state.sidebarMinimized };
    case 'TOGGLE_MOBILE_SIDEBAR':
      return { ...state, isMobileSidebarOpen: !state.isMobileSidebarOpen };
    case 'ADD_MESSAGE':
      return {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload.reportId
            ? { ...report, chat: [...report.chat, action.payload.message] }
            : report
        ),
      };
    case 'UPDATE_REPORT':
      return {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload.reportId
            ? { ...report, ...action.payload.updates }
            : report
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children, initialReports }: { children: ReactNode; initialReports: Report[] }) {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    reports: initialReports,
    selectedReportId: initialReports && initialReports.length > 0 ? initialReports[0].id : '',
  });

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    console.log('Usuario ha cerrado sesión');
  };

  return (
    <AppContext.Provider 
      value={{ state, dispatch, logout }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 