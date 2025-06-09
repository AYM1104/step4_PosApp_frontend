'use client';

import { useSearchParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { Box, Typography } from '@mui/material';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

// ✅ QRコード表示用の小さな部品
function QRContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id') ?? '';

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography variant="h6">あなた専用のQRコード</Typography>
      {userId ? (
        <QRCodeCanvas value={userId} size={256} />
      ) : (
        <Typography color="error">ユーザーIDが取得できませんでした。</Typography>
      )}
    </Box>
  );
}

// ✅ メインの画面（Suspenseでラップ）
export default function QRPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <QRContent />
    </Suspense>
  );
}