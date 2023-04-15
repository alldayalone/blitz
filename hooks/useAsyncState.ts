import { useEffect, useState } from "react";

export function useAsyncState<T>(fn: () => Promise<T>) {
  const [state, setState] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const asyncSetState = useEffect(() => {
    async function main() {
      try {
        setError(null);
        setState(await fn())
      } catch (error) {
        if (error instanceof Error) {
          setError(error)
        } else {
          setError(new Error('Something went wrong'))
        }
      } finally {
        setLoading(false)
      }
    }

    main();
  }, [fn])

  return [state, asyncSetState, loading, error] as const
}