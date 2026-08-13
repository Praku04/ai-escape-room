import { ThemeType } from '../types/game';

export interface ThemeConfig {
  name: string;
  subtitle: string;
  icon: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  accentColor: string;
  textColor: string;
  mutedText: string;
  primaryButton: string;
  headerBg: string;
  terminalBg: string;
  fontFamily: string;
}

export const THEME_STYLES: Record<ThemeType, ThemeConfig> = {
  SCHOOL_DAY: {
    name: 'SCHOOL DAY',
    subtitle: 'Classroom Fun & Learning Adventures',
    icon: '🎒',
    bgGradient: 'bg-blue-950 text-blue-100',
    cardBg: 'bg-blue-900/80 backdrop-blur-md',
    cardBorder: 'border-blue-400/40',
    accentColor: 'text-blue-300',
    textColor: 'text-blue-100',
    mutedText: 'text-blue-300/70',
    primaryButton: 'bg-blue-500 hover:bg-blue-400 text-white font-bold shadow-lg shadow-blue-900/30',
    headerBg: 'bg-blue-900/90 border-b border-blue-400/30',
    terminalBg: 'bg-blue-950 border border-blue-800',
    fontFamily: 'font-sans'
  },
  PET_RESCUE: {
    name: 'PET RESCUE',
    subtitle: 'Help Animals & Solve Pet Mysteries',
    icon: '🐶',
    bgGradient: 'bg-green-950 text-green-100',
    cardBg: 'bg-green-900/80 backdrop-blur-md',
    cardBorder: 'border-green-400/40',
    accentColor: 'text-green-300',
    textColor: 'text-green-100',
    mutedText: 'text-green-300/70',
    primaryButton: 'bg-green-500 hover:bg-green-400 text-white font-bold shadow-lg shadow-green-900/30',
    headerBg: 'bg-green-900/90 border-b border-green-400/30',
    terminalBg: 'bg-green-950 border border-green-800',
    fontFamily: 'font-sans'
  },
  TREASURE_HUNT: {
    name: 'TREASURE HUNT',
    subtitle: 'Find Hidden Treasures & Solve Puzzles',
    icon: '🏴‍☠️',
    bgGradient: 'bg-orange-950 text-orange-100',
    cardBg: 'bg-orange-900/80 backdrop-blur-md',
    cardBorder: 'border-orange-400/40',
    accentColor: 'text-orange-300',
    textColor: 'text-orange-100',
    mutedText: 'text-orange-300/70',
    primaryButton: 'bg-orange-500 hover:bg-orange-400 text-white font-bold shadow-lg shadow-orange-900/30',
    headerBg: 'bg-orange-900/90 border-b border-orange-400/30',
    terminalBg: 'bg-orange-950 border border-orange-800',
    fontFamily: 'font-sans'
  },
  SUPERHERO: {
    name: 'SUPERHERO MISSION',
    subtitle: 'Save the City & Be a Hero',
    icon: '🦸',
    bgGradient: 'bg-purple-950 text-purple-100',
    cardBg: 'bg-purple-900/80 backdrop-blur-md',
    cardBorder: 'border-purple-400/40',
    accentColor: 'text-purple-300',
    textColor: 'text-purple-100',
    mutedText: 'text-purple-300/70',
    primaryButton: 'bg-purple-500 hover:bg-purple-400 text-white font-bold shadow-lg shadow-purple-900/30',
    headerBg: 'bg-purple-900/90 border-b border-purple-400/30',
    terminalBg: 'bg-purple-950 border border-purple-800',
    fontFamily: 'font-sans'
  }
};
