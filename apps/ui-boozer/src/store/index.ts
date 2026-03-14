// Zustand store configuration
import { create } from 'zustand'

type Language = 'es' | 'en' | null
type GameMode = 'solo' | 'group' | null

interface SessionState {
  language: Language
  gameMode: GameMode
  playerName: string
  paymentCompleted: boolean
  result: number | null
  resultLabel: string | null
}

interface SessionActions {
  setLanguage: (language: Language) => void
  setGameMode: (mode: GameMode) => void
  setPlayerName: (name: string) => void
  setPaymentCompleted: (value: boolean) => void
  setResult: (value: number | null) => void
  setResultLabel: (label: string | null) => void
  resetSession: () => void
}

type SessionStore = SessionState & SessionActions

const initialState: SessionState = {
  language: null,
  gameMode: null,
  playerName: '',
  paymentCompleted: false,
  result: null,
  resultLabel: null,
}

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialState,
  setLanguage: (language) => set({ language }),
  setGameMode: (mode) => set({ gameMode: mode }),
  setPlayerName: (name) => set({ playerName: name }),
  setPaymentCompleted: (value) => set({ paymentCompleted: value }),
  setResult: (value) => set({ result: value }),
  setResultLabel: (label) => set({ resultLabel: label }),
  resetSession: () => set(initialState),
}))