/* eslint-disable solid/prefer-for */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import useStore from '~/store/kanaSelection'
import CharGroupSelect from '~/components/CharGroupSelect'

import { MONOGRAPHS } from '~/constants/kana'

const App = () => {
   const state = useStore()
   const { toggleAllChars, toggleChars } = state

   return (
      <main class="mx-auto grid max-w-lg grid-cols-12 py-16">
         <header class="col-span-12 mb-16">
            <h1 class="text-center text-4xl font-bold">kanakata</h1>
         </header>

         <section class="col-span-12">
            <CharGroupSelect
               chars={MONOGRAPHS}
               selectedChars={state.selectedHiraganaMonographs}
               toggleChars={toggleChars}
               toggleAllChars={toggleAllChars}
            />
            <div class="flex">{JSON.stringify(state.selectedHiraganaMonographs)}</div>
         </section>
      </main>
   )
}

export default App
