'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import BarcodeScanner from '../compornents/BarcodeScanner';
import { sendPurchaseToLine } from '../line/send/sendToLine';
import { CartItem } from '@/types/product';
import { useState } from 'react';

export default function ConfirmContent() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const cartJson = searchParams.get('cart');
  const cartItems: CartItem[] = cartJson ? JSON.parse(decodeURIComponent(cartJson)) : [];

  const handleDetect = async (userId: string) => {
    const result = await sendPurchaseToLine(userId, cartItems);
    setIsSent(result);
    setMessage(result ? '送信成功' : '送信失敗');
  };

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>LINEに送信</Typography>
      {!isSent && <>
        <Typography>QRコードをかざしてユーザーを認証してください</Typography>
        <BarcodeScanner onDetect={handleDetect} />
      </>}
      {message && <Typography mt={2}>{message}</Typography>}
      {isSent && <Button sx={{ mt: 3 }} onClick={() => router.push('/')}>トップへ戻る</Button>}
    </Box>
  );
}