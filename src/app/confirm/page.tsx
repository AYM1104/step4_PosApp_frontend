'use client';

import { Box, Button, Typography } from "@mui/material";
import Image from 'next/image';
import { useState } from 'react';
import BarcodeScanner from '../compornents/BarcodeScanner';
import { sendPurchaseToLine } from "../line/send/sendToLine";
import { useSearchParams, useRouter } from 'next/navigation';
import { CartItem } from '@/types/product';

export default function LineConfirmPage() {
  const [, setUserId] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // 👈 スキャナー表示管理
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // クエリからカート情報を取得
  const cartJson = searchParams.get('cart');
  console.log("[DEBUG] cartJson:", cartJson);
  const cartItems: CartItem[] = cartJson ? JSON.parse(decodeURIComponent(cartJson)) : [];

  const handleDetect = async (detectedUserId: string) => {
    setUserId(detectedUserId);

    try {
      const result = await sendPurchaseToLine(detectedUserId, cartItems);
      if (result) {
        setIsSent(true);
        setMessage('✅ LINEに購入内容を送信しました！');
      } else {
        setMessage('❌ LINE送信に失敗しました');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ エラーが発生しました');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
    >
      {/* 完了メッセージ */}
      <Typography variant="h4" gutterBottom>
        🎉 購入が完了しました
      </Typography>

      {/* LINE送信ボタン（スキャナー表示トリガー） */}
      {!isSent && !isScanning && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsScanning(true)}
          sx={{ mt: 4, fontSize: 18, px: 4, py: 1.5 }}
        >
          LINEに送信する
        </Button>
      )}

      {/* スキャナー表示エリア */}
      {isScanning && (
        <>
          <Typography variant="body1" mt={4}>
            QRコードをかざしてユーザーを認証してください
          </Typography>
          <Box mt={2}>
            <BarcodeScanner onDetect={handleDetect} />
          </Box>
        </>
      )}

      {/* メッセージ */}
      {message && (
        <Typography mt={4} color={isSent ? 'success.main' : 'error.main'}>
          {message}
        </Typography>
      )}

      {/* 完了後の遷移ボタン */}
      {isSent && (
        <Button sx={{ mt: 4 }} variant="contained" onClick={() => router.push('/')}>
          トップへ戻る
        </Button>
      )}

      {/* 友だち登録の案内 */}
      <Box mt={6} textAlign="center">
        <Typography variant="body1" gutterBottom>
          友だち登録がまだの方はこちらから
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Image
            src="/img/line_friend_register.png"
            alt="LINE友だち登録QR"
            width={220}
            height={220}
            priority
          />
        </Box>
      </Box>
    </Box>
  );
}