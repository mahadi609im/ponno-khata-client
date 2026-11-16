import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import './index.css';
import router from './router/router';
import { ContextProvider } from './Context/ContextProvider';

const ONE_DAY = 1000 * 60 * 60 * 24;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // data is fresh for 5 minutes
      gcTime: ONE_DAY, // must be >= maxAge below
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'ponno-khata-cache',
  throttleTime: 5000, // NEW: save at most once every 5 seconds
});

// NEW: save only the main data, not duplicate product lists
const PERSISTED_KEYS = ['grouped-products', 'categories'];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: ONE_DAY,
        buster: 'v2', // NEW: clears the old big cache for all users
        dehydrateOptions: {
          // NEW: filter what goes into localStorage
          shouldDehydrateQuery: query =>
            query.state.status === 'success' &&
            PERSISTED_KEYS.includes(query.queryKey[0]),
        },
      }}
    >
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
);
