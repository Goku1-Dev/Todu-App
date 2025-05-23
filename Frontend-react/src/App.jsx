import React from 'react'
import Layout from './Layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.scss';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  )
}

export default App