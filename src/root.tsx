// @refresh reload
import { Suspense } from 'solid-js'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  Link,
} from 'solid-start'
import './root.css'

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>kanakata</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="description" content="A simple kana (hiragana & katakana) quiz" />
        <Meta name="keywords" content="japanese, hiragana, katakana, kana, learn japanese, japanese characters, japanese quiz, language learning, nihongo" />
        <Meta name="author" content="arkhlima" />
        <Meta name="robots" content="index, follow" />
        <Meta name="language" content="en" />

        <Meta property="og:type" content="website" />
        <Meta property="og:title" content="kanakata" />
        <Meta property="og:description" content="A simple kana (hiragana & katakana) quiz" />
        <Meta property="og:image" content="/favicon.ico" />
        <Meta property="og:url" content="https://kanakata.vercel.app" />
        <Meta property="og:site_name" content="kanakata" />

        <Meta name="twitter:card" content="summary" />
        <Meta name="twitter:title" content="kanakata" />
        <Meta name="twitter:description" content="A simple kana (hiragana & katakana) quiz." />
        <Meta name="twitter:image" content="/favicon.ico" />

        <Meta name="theme-color" content="#334155" />
        <Meta name="apple-mobile-web-app-capable" content="yes" />
        <Meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <Meta name="apple-mobile-web-app-title" content="kanakata" />
        <Link rel="apple-touch-icon" href="/favicon.ico" />
        <Link rel="icon" type="image/x-icon" href="/favicon.ico" />

        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <Link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&family=Poppins:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Body class="bg-slate-50 bg-fixed font-sans text-slate-700">
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
