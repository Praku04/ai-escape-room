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
  REAL_WORLD: {
    name: 'REAL WORLD',
    subtitle: 'Crisis & Customer Survival',
    icon: '✈️',
    bgGradient: 'bg-slate-950 text-slate-100',
    cardBg: 'bg-slate-900/80 backdrop-blur-md',
    cardBorder: 'border-teal-500/30',
    accentColor: 'text-teal-400',
    textColor: 'text-slate-100',
    mutedText: 'text-slate-400',
    primaryButton: 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/30',
    headerBg: 'bg-slate-900/90 border-b border-teal-500/20',
    terminalBg: 'bg-slate-950 border border-slate-800',
    fontFamily: 'font-sans'
  },
  MYSTERY: {
    name: 'THE MYSTERY FILES',
    subtitle: 'Detective Noir & Interrogation',
    icon: '🕵️',
    bgGradient: 'bg-zinc-950 text-amber-50',
    cardBg: 'bg-zinc-900/90 backdrop-blur-md',
    cardBorder: 'border-amber-500/30',
    accentColor: 'text-amber-400',
    textColor: 'text-amber-100',
    mutedText: 'text-zinc-400',
    primaryButton: 'bg-amber-600 hover:bg-amber-500 text-zinc-950 font-semibold shadow-lg shadow-amber-900/30',
    headerBg: 'bg-zinc-900/90 border-b border-amber-500/20',
    terminalBg: 'bg-zinc-950 border border-zinc-800',
    fontFamily: 'font-mono'
  },
  NEURAL_BREAK: {
    name: 'NEURAL BREAK',
    subtitle: 'AI & Cyber Future Mainframe',
    icon: '🤖',
    bgGradient: 'bg-gray-950 text-cyan-100',
    cardBg: 'bg-gray-900/90 backdrop-blur-md',
    cardBorder: 'border-cyan-500/40',
    accentColor: 'text-cyan-400',
    textColor: 'text-cyan-100',
    mutedText: 'text-cyan-400/60',
    primaryButton: 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/20',
    headerBg: 'bg-gray-900/95 border-b border-cyan-500/30',
    terminalBg: 'bg-black border border-cyan-500/30',
    fontFamily: 'font-mono'
  },
  AVALORIA: {
    name: 'THE CURSE OF AVALORIA',
    subtitle: 'Fantasy Adventure & Ancient Runes',
    icon: '🏰',
    bgGradient: 'bg-slate-950 text-purple-100',
    cardBg: 'bg-purple-950/40 backdrop-blur-md',
    cardBorder: 'border-purple-500/30',
    accentColor: 'text-purple-300',
    textColor: 'text-purple-100',
    mutedText: 'text-purple-300/60',
    primaryButton: 'bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-lg shadow-purple-900/40',
    headerBg: 'bg-purple-950/80 border-b border-purple-500/30',
    terminalBg: 'bg-purple-950/60 border border-purple-800/40',
    fontFamily: 'font-serif'
  }
};
