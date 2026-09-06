import { create } from 'zustand'

type Language = 'es' | 'en' | null
type GameMode = 'solo' | 'group' | null
export type PlayerCount = 1 | 2 | 3 | 4 | 5

export interface SessionPlayer {
  id: number
  name: string
  result: number | null
  resultLabel: string | null
}

interface SessionState {
  language: Language
  gameMode: GameMode
  playerCount: PlayerCount
  currentPlayerIndex: number
  players: SessionPlayer[]
  playerName: string
  paymentId: string | null
  paymentInFlight: boolean
  paymentCompleted: boolean
  result: number | null
  resultLabel: string | null
}

interface SessionActions {
  setLanguage: (language: Language) => void
  setGameMode: (mode: GameMode) => void
  setPlayerCount: (count: PlayerCount) => void
  advanceToNextPlayer: () => void
  setPlayerName: (name: string) => void
  setPaymentId: (id: string | null) => void
  setPaymentInFlight: (value: boolean) => void
  setPaymentCompleted: (value: boolean) => void
  setResult: (value: number | null) => void
  setResultLabel: (label: string | null) => void
  resetSession: () => void
}

type SessionStore = SessionState & SessionActions

const createPlayers = (count: PlayerCount): SessionPlayer[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: '',
    result: null,
    resultLabel: null,
  }))

const initialState: SessionState = {
  language: null,
  gameMode: null,
  playerCount: 1,
  currentPlayerIndex: 0,
  players: createPlayers(1),
  playerName: '',
  paymentId: null,
  paymentInFlight: false,
  paymentCompleted: false,
  result: null,
  resultLabel: null,
}

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialState,
  setLanguage: (language) => set({ language }),
  setGameMode: (mode) =>
    set((state) => {
      const playerCount = mode === 'solo' ? 1 : state.playerCount

      return {
        gameMode: mode,
        playerCount,
        currentPlayerIndex: 0,
        players: createPlayers(playerCount),
        playerName: '',
        paymentId: null,
        paymentInFlight: false,
        paymentCompleted: false,
        result: null,
        resultLabel: null,
      }
    }),
  setPlayerCount: (count) =>
    set({
      playerCount: count,
      currentPlayerIndex: 0,
      players: createPlayers(count),
      playerName: '',
      paymentId: null,
      paymentInFlight: false,
      paymentCompleted: false,
      result: null,
      resultLabel: null,
    }),
  advanceToNextPlayer: () =>
    set((state) => {
      const nextIndex = Math.min(
        state.currentPlayerIndex + 1,
        state.playerCount - 1
      )
      const nextPlayer = state.players[nextIndex]

      return {
        currentPlayerIndex: nextIndex,
        playerName: nextPlayer?.name ?? '',
        result: nextPlayer?.result ?? null,
        resultLabel: nextPlayer?.resultLabel ?? null,
      }
    }),
  setPlayerName: (name) =>
    set((state) => ({
      playerName: name,
      players: state.players.map((player, index) =>
        index === state.currentPlayerIndex ? { ...player, name } : player
      ),
    })),
  setPaymentId: (paymentId) => set({ paymentId }),
  setPaymentInFlight: (paymentInFlight) => set({ paymentInFlight }),
  setPaymentCompleted: (value) => set({ paymentCompleted: value }),
  setResult: (value) =>
    set((state) => ({
      result: value,
      players: state.players.map((player, index) =>
        index === state.currentPlayerIndex
          ? { ...player, result: value }
          : player
      ),
    })),
  setResultLabel: (label) =>
    set((state) => ({
      resultLabel: label,
      players: state.players.map((player, index) =>
        index === state.currentPlayerIndex
          ? { ...player, resultLabel: label }
          : player
      ),
    })),
  resetSession: () => set(initialState),
}))
