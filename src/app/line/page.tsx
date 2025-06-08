'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import BarcodeScanner from '../compornents/BarcodeScanner';
import { sendPurchaseToLine } from './sendToLine';
import { useSearchParams, useRouter } from 'next/navigation';
import { CartItem } from '@/types/product';

export default function LineSendPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // クエリからカート内容を取得
  const cartJson = searchParams.get('cart');
  const cartItems: CartItem[] = cartJson ? JSON.parse(decodeURIComponent(cartJson)) : [];

  const handleDetect = async (detectedUserId: string) => {
    setUserId(detectedUserId);

    try {
      const result = await sendPurchaseToLine(detectedUserId, cartItems);
      if (result) {
        setIsSent(true);
        setMessage('LINEに購入内容を送信しました！');
      } else {
        setMessage('LINE送信に失敗しました');
      }
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
          <Typography variant="body1" mb={1}>QRコードをかざしてユーザーを認証してください</Typography>
          <BarcodeScanner onDetect={handleDetect} />
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