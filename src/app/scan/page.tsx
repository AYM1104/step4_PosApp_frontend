'use client';

import { useState, useEffect, useRef } from 'react';
import BarcodeScanner from '../compornents/BarcodeScanner_0';
import CartTable from '../compornents/CartTable';
import { fetchProductFromDB } from '@/lib/fetchProductFromDB';
import { CartItem } from '@/types/product'; // ✅ 追加
import { Button, Typography,Box } from '@mui/material';

export default function ScanPage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [receipt, setReceipt] = useState<{
    total_excluding_tax: number;
    total_tax: number;
    total_amount: number;
  } | null>(null); // ✅ レシート用ステートを追加

  const beepAudio = useRef<HTMLAudioElement | null>(null);
  const lastScanRef = useRef<{ jan_code: string; timestamp: number } | null>(null);

  useEffect(() => {
    beepAudio.current = new Audio('/sound/barcode.mp3');
  }, []);

  const handleStartScan = () => {
    // ✅ 音声再生を一度試みる（スマホでの自動再生制限を回避）
    beepAudio.current?.play().catch((e) =>
      console.warn('📵 スマホの自動再生制限により音が鳴らない場合があります', e)
    );
    setIsScannerOpen(true);
  };

  // ✅ ここに全てのロジックを集中
  const handleDetect = (scannedCode: string) => {
    const now = Date.now();

    if (
      lastScanRef.current?.jan_code === scannedCode &&
      now - lastScanRef.current.timestamp < 3000
    ) {
      console.log('⏳ 同じ商品を3秒以内に再スキャン → 無視');
      return;
    }

    lastScanRef.current = { jan_code: scannedCode, timestamp: now };

    fetchProductFromDB(scannedCode).then((data) => {
      if (data && data.price !== undefined) {
        beepAudio.current?.play().catch((e) =>
          console.warn('音声再生に失敗しました', e)
        );

        const newItem: CartItem = {
          jan_code: data.jan_code,
          name: data.name,
          price: data.price,
          quantity: 1,
        };

        setCartItems((prev) => [...prev, newItem]);
      } else {
        alert('商品が見つかりませんでした');
      }
    });
  };

  const handleCheckout = async () => {
  if (cartItems.length === 0) {
    alert('カートが空です');
    return;
  }

  try {
    const payload = {
      items: cartItems.map((item) => ({
        jan_code: item.jan_code,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('🧾 会計結果:', data);

      // ✅ レシート情報をセット
      setReceipt({
        total_excluding_tax: data.total_excluding_tax,
        total_tax: data.total_tax,
        total_amount: data.total_amount,
      });

    alert('✅ 会計が完了しました');
    setCartItems([]); // カートをリセット
  } catch (error) {
    console.error('❌ 会計処理エラー:', error);
    alert('会計に失敗しました');
  }
};

  return (
    <Box style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        商品をスキャンしてカートに追加
      </Typography>

      <Button variant="contained" onClick={handleStartScan}>
        スキャンを開始する
      </Button>

      {isScannerOpen && (
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'flex-start',
          }}
        >
          

          {/* 🛒 カート */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CartTable
              items={cartItems}
              onDelete={(janCode: string) =>
                setCartItems((items) => items.filter((i) => i.jan_code !== janCode))
              }
            />
          </Box>

          {/* 📷 カメラ */}
          <Box sx={{ flex: '0 0 auto' }}>
            <BarcodeScanner onDetect={handleDetect} />
          </Box>
        </Box>
      )}

      {/* 会計ボタン */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckout}
        sx={{ mt: 2 }}
      >
        会計する
      </Button>

      {/* ✅ 会計後のレシート表示 */}
      {receipt && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">税抜金額: ¥{receipt.total_excluding_tax}</Typography>
          <Typography variant="subtitle1">消費税: ¥{receipt.total_tax}</Typography>
          <Typography variant="h6" fontWeight="bold">
            合計（税込）: ¥{receipt.total_amount}
          </Typography>
        </Box>
      )}

    </Box>
  );
}