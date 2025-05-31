'use client';

import BarcodeScanner from '../compornents/BarcodeScanner';
import { useState } from 'react';

export default function TestScanPage() {
  const [code, setCode] = useState<string | null>(null);

  return (
    <div style={{ padding: 24 }}>
      <h2>バーコードスキャンテスト</h2>
      <BarcodeScanner onDetect={(detectedCode) => setCode(detectedCode)} />
      {code && <p>スキャン結果: {code}</p>}
    </div>
  );
}