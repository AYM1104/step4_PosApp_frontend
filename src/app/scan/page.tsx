'use client';

import { useState, useEffect, useRef } from 'react';
import BarcodeScanner from '../compornents/BarcodeScanner';
import CartTable from '../compornents/CartTable';
import { fetchProductFromDB } from '@/lib/fetchProductFromDB';
import { CartItem } from '@/types/product'; // ✅ 追加
import { Button, Typography } from '@mui/material';

export default function ScanPage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const beepAudio = useRef<HTMLAudioElement | null>(null);
  const lastScanRef = useRef<{ jan_code: string; timestamp: number } | null>(null);

  useEffect(() => {
    beepAudio.current = new Audio('/sound/barcode.mp3');
  }, []);

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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    alert('✅ 会計が完了しました');
    setCartItems([]); // カートをリセット
  } catch (error) {
    console.error('❌ 会計処理エラー:', error);
    alert('会計に失敗しました');
  }
};

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        商品をスキャンしてカートに追加
      </Typography>

      <Button variant="contained" onClick={() => setIsScannerOpen(true)}>
        スキャンを開始する
      </Button>

      {isScannerOpen && (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <BarcodeScanner onDetect={handleDetect} />
        </div>
      )}

      <CartTable
        items={cartItems}
        onDelete={(janCode: string) =>
          setCartItems((items) => items.filter((i) => i.jan_code !== janCode))
        }
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckout}
        style={{ marginTop: 16 }}
      >
        会計する
      </Button>

    </div>
  );
}