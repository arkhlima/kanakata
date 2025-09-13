import { Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'

const Home = lazy(() => import('./routes/index'))
const Quiz = lazy(() => import('./routes/quiz'))
const NotFound = lazy(() => import('./routes/[...404]'))

export default function App() {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/quiz" component={Quiz} />
      <Route path="*" component={NotFound} />
    </Router>
  )
}
