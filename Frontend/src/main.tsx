import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import { AppRouter } from './App/AppRouter'
import './styles/index.css'
import LenisProvider from './styles/lenis/LenisProvider'
import { ErrorBoundary } from './shared/components/ErrorBoundary'
import { analytics } from './shared/services/analytics.service'
import { errorMonitor } from './shared/services/error.service'
import './pwa/register'
import "./i18n"



// Initialize services
analytics.init();
errorMonitor.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <LenisProvider>
            <AppRouter />
          </LenisProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
