'use client';

import { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

type Props = {
  children: ReactNode;
};

export default function EmotionRootProvider({ children }: Props) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      
        <CssBaseline />
        {children}
      
    </CacheProvider>
  );
}