import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import store from './store/index.js'
import { StoreProvider } from './store/provider.jsx'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
import App from './App.jsx'
import './styles/app.scss'

// Enable mocking in development mode
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser.js')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
}

enableMocking().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <StoreProvider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StoreProvider>
    </StrictMode>,
  )
})
