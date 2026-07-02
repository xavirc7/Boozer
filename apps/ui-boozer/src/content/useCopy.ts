import copy from './copy.json'
import { useSessionStore } from '../store/sessionStore'

type CopyLanguage = keyof typeof copy

export type AppCopy = (typeof copy)[CopyLanguage]

export const interpolate = (
  template: string,
  values: Record<string, string | number>
) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.split(`{{${key}}}`).join(String(value)),
    template
  )

export function useCopy() {
  const language = useSessionStore((state) => state.language)
  const copyLanguage: CopyLanguage = language ?? 'es'

  return copy[copyLanguage]
}
