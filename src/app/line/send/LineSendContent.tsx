'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import QRCodeScanner, { QRCodeScannerRef } from '@/app/compornents/QRCodeScanner';
import { sendPurchaseToLine } from './sendToLine';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types/product';

export default function LineSendContent() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');
  const [, setCartItems] = useState<CartItem[]>([]);
  const [showScanner, setShowScanner] = useState(true); // ✅ 表示制御フラグ
  const scannerRef = useRef<QRCodeScannerRef>(null); // ✅ スキャナー停止用ref
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('pos_cart');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('📦 読み込み成功:', parsed);
        setCartItems(parsed);
      } catch (err) {
        console.error('🛑 cartの読み取りに失敗', err);
      }
    } else {
      console.warn('⚠️ localStorage.pos_cart は空です');
    }
  }, []);

  const handleDetect = async (userId: string) => {
    scannerRef.current?.stop(); // ✅ カメラと音を止める

    if (!userId) {
      setMessage('ユーザーIDが無効です');
      return;
    }

    const stored = localStorage.getItem('pos_cart');
    const parsedCart: CartItem[] = stored ? JSON.parse(stored) : [];

    console.log("🛒 userId:", userId);
    console.log("🛒 parsedCart:", parsedCart);

    if (parsedCart.length === 0) {
      setMessage('カートが空です');
      return;
    }

    try {
      const result = await sendPurchaseToLine(userId, parsedCart); // ✅ parsedCartを送信
      if (result) {
        setIsSent(true);
        setMessage('LINEに購入内容を送信しました！');
        setShowScanner(false); // ✅ 成功時のみ非表示
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

      {showScanner && !isSent && (
        <>
          <Typography>QRコードをかざしてユーザーを認証してください</Typography>
          <QRCodeScanner ref={scannerRef} onDetect={handleDetect} />
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