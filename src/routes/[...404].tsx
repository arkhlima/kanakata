import { A } from '@solidjs/router'
import General from '~/layouts/general'

export default function NotFound() {
  return (
    <General>
      <main class="col-span-12 mx-auto p-4 text-center text-slate-700">
        <h1 class="my-16 font-bold text-6xl text-slate-700 uppercase">404</h1>
        <p class="mt-8 text-lg">Page not found</p>
        <p class="my-4">
          <A href="/" class="text-blue-600 hover:underline">
            ← Back to Home
          </A>
          {' | '}
          <A href="/quiz" class="text-blue-600 hover:underline">
            Go to Quiz
          </A>
        </p>
      </main>
    </General>
  )
}
