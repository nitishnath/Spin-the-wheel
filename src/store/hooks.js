import { useContext, useSyncExternalStore } from 'react'
import { StoreContext } from './context.js'

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('StoreProvider is missing. Wrap your app with StoreProvider.')
  return store
}

export function useAppDispatch() {
  return useStore().dispatch
}

export function useAppSelector(selector) {
  const store = useStore()
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  )
}