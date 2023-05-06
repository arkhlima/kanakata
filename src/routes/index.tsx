/* eslint-disable solid/prefer-for */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import useStore from '~/store'
import CharGroup from '~/components/CharGroup'

const App = () => {
   const state = useStore()
   const { toggleAllHiraganaMonographs, toggleHiraganaMonographs } = state

   return (
      <main class="mx-auto grid max-w-lg grid-cols-12 py-16">
         <header class="col-span-12 mb-16">
            <h1 class="text-center text-4xl font-bold">kanakata</h1>
         </header>

         <section class="col-span-12">
            <CharGroup
               chars={state.hiraganaMonographs}
               selectedChars={state.selectedHiraganaMonographs}
               toggleChars={toggleHiraganaMonographs}
               toggleAllChars={toggleAllHiraganaMonographs}
            />
         </section>
      </main>
   )
}

export default App
