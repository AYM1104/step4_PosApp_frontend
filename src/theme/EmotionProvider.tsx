'use client';

import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/lib/createEmotionCache';
import { ReactNode } from 'react';

const clientSideEmotionCache = createEmotionCache();

export default function EmotionProvider({ children }: { children: ReactNode }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      {children}
    </CacheProvider>
  );
}