'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const cart = searchParams.get('cart');

  const handleSendToLine = () => {
    router.push(`/line/send?cart=${cart}`);
  };

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h4" gutterBottom>
        🎉 購入が完了しました
      </Typography>
      <Typography variant="body1" mb={4}>
        ご希望の方はLINEにレシートを送信できます
      </Typography>

      {/* ✅ ボタンを横並びに */}
      <Box display="flex" justifyContent="center" gap={2} mb={6}>
        <Button variant="contained" color="primary" onClick={handleSendToLine}>
          LINEに送信する
        </Button>
        <Button variant="outlined" color="primary" onClick={() => router.push('/')}>
          トップへ戻る
        </Button>
      </Box>

      {/* ✅ QRコード表示 */}
      <Box mt={6}>
        <Typography variant="body2" mb={2}>
          まだLINEの友だち登録をされていない方はこちら
        </Typography>
        <Box display="flex" justifyContent="center">
          <Image
            src="/img/line_friend_register.png"
            alt="LINE友だち登録QRコード"
            width={200}
            height={200}
          />
        </Box>
      </Box>
    </Box>
  );
}

