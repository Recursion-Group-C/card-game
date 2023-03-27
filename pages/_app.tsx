import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { AppProps } from 'next/app'
import '../styles/globals.css';

const App = ({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session,
}>) => {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      {/* eslint-disable react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
export default App
