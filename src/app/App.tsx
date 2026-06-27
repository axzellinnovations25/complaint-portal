import { AppProviders } from './providers/AppProviders'
import { RouteRegistry } from './router/RouteRegistry'

export function App() {
  return (
    <AppProviders>
      <RouteRegistry />
    </AppProviders>
  )
}
