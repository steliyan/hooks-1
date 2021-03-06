import * as React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

type IdCallback = () => string

const Context = createContext<IdCallback | undefined>(undefined)

type IdProviderProps = {
  children: React.ReactNode
}

// Client side fallback "id" for cases where the application is not surrounded with an <IdProvider />
let fallbackId = 0

export const IdProvider = (props: IdProviderProps) => {
  const ref = useRef(0)
  const generateId = useCallback(() => (++ref.current).toString(), [])

  return (
    <Context.Provider value={generateId}>{props.children}</Context.Provider>
  )
}

/**
 * Return a deterministic Id for this Hook. Optionally add prefix to the id
 * @param prefix
 */
const useId = (prefix?: string) => {
  const generateId = useContext(Context)
  // Prefer generating the id from the IdProvider context.
  const [id, setId] = useState(generateId ? generateId() : undefined)

  useEffect(() => {
    // If the Provider is not included, we fallback to generating an id as a clientside sideffect.
    if (!id) {
      setId((++fallbackId).toString())
    }
  }, [])

  // If the id isn't set yet, return undefined.
  if (!id) return undefined
  return prefix ? `${prefix}_${id}` : id
}

export default useId
