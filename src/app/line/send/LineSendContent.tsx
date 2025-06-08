'use client';

import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import QRCodeScanner from '@/app/compornents/QRCodeScanner';
import { sendPurchaseToLine } from './sendToLine';
import { useSearchParams, useRouter } from 'next/navigation';
import { CartItem } from '@/types/product';

export default function LineSendContent() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const cartJson = searchParams.get('cart');
  const cartItems: CartItem[] = cartJson ? JSON.parse(decodeURIComponent(cartJson)) : [];

  const handleDetect = async (userId: string) => {
    if (!userId) {
    setMessage('ユーザーIDが無効です');
    return;
    }
    try {
      const result = await sendPurchaseToLine(userId, cartItems);
      setIsSent(result);
      setMessage(result ? 'LINEに購入内容を送信しました！' : 'LINE送信に失敗しました');
    } catch (err) {
      console.error(err);
      setMessage('エラーが発生しました');
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>LINEに送信</Typography>

      {!isSent && (
        <>
          <Typography>QRコードをかざしてユーザーを認証してください</Typography>
          <QRCodeScanner onDetect={handleDetect} />
        </>
      )}

      {message && (
        <Typography mt={2} color={isSent ? 'success.main' : 'error.main'}>
          {message}
        </Typography>
      )}

      {isSent && (
        <Button sx={{ mt: 3 }} variant="contained" onClick={() => router.push('/')}>
          トップへ戻る
        </Button>
      )}
    </Box>
  );
}