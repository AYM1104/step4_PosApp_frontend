'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import { CartItem } from '@/types/product';

export default function ConfirmPage() {
  const [, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  // ✅ localStorageからカート情報を取得
  useEffect(() => {
    const json = localStorage.getItem('pos_cart');
    if (json) {
      try {
        setCartItems(JSON.parse(json));
      } catch (e) {
        console.error('カートデータの読み込みに失敗しました', e);
      }
    }
  }, []);

  const handleSendToLine = () => {
    router.push('/line/send');
  };

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h4" gutterBottom>
        購入が完了しました
      </Typography>
      <Typography variant="body1" mb={4}>
        ご希望の方はLINEに購入履歴を送信できます。<br /><br />
        友達登録が済んでいる方は、LINEで「QRコード」と<br />入力すると専用QRコードが発行されます。
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} mb={6}>
        <Button variant="contained" color="primary" onClick={handleSendToLine}>
          LINEに送信する
        </Button>
        <Button variant="outlined" color="primary" onClick={() => router.push('/')}>
          トップへ戻る
        </Button>
      </Box>

      <Box mt={6} display="flex" justifyContent="center">
        <Typography variant="body2" mb={2}>
          まだLINEの友だち登録をされていない方はこちら<br />
          ↓↓↓<br /><br />
          〈LINE友だち登録用QRコード〉<br />
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <Image
          src="/img/line_friend_register.png"
          alt="LINE友だち登録QRコード"
          width={200}
          height={200}
        />
      </Box>
    </Box>
  );
}