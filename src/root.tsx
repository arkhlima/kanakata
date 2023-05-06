// @refresh reload
import { Suspense } from 'solid-js'
import {
   Body,
   ErrorBoundary,
   FileRoutes,
   Link,
   Head,
   Html,
   Meta,
   Routes,
   Scripts,
   Title,
} from 'solid-start'
import './root.css'

export default function Root() {
   return (
      <Html lang="en">
         <Head>
            <Title>kanakata</Title>
            <Meta charset="utf-8" />
            <Meta name="viewport" content="width=device-width, initial-scale=1" />
            <Link rel="preconnect" href="https://fonts.googleapis.com" />
            <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <Link
               href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&family=Poppins:wght@400;700&display=swap"
               rel="stylesheet"
            />
         </Head>
         <Body class="bg-slate-100 bg-fixed font-sans text-slate-800">
            <Suspense>
               <ErrorBoundary>
                  <Routes>
                     <FileRoutes />
                  </Routes>
               </ErrorBoundary>
            </Suspense>
            <Scripts />
         </Body>
      </Html>
   )
}
