// src/app/line/qr/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { Box, Typography } from '@mui/material';

export default function QRPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id') ?? '';

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h6">あなた専用のQRコード</Typography>
      {userId ? (
        <QRCodeCanvas value={userId} size={256} />
      ) : (
        <Typography color="error">ユーザーIDが取得できませんでした。</Typography>
      )}
    </Box>
  );
}