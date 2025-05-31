'use client';

import BarcodeScanner from '../compornents/BarcodeScanner';
import { useState, useEffect } from 'react';
import { fetchProductInfoByJan } from '@/lib/fetchProductInfo';
import { Product } from '@/types/product';
import Image from 'next/image';

export default function TestScanPage() {
  const [code, setCode] = useState<string | null>(null);          // スキャンされたJANコード
  const [product, setProduct] = useState<Product | null>(null);  // 取得した商品情報
  const [loading, setLoading] = useState(false);                  // ローディング状態

  // codeが更新されたら商品情報を取得する（fetchProductInfoByJanを使用）
  useEffect(() => {
    if (!code) return;

    const loadProduct = async () => {
      setLoading(true);

      // JANコードAPIから商品情報を取得（商品名、商品画像）
      const result = await fetchProductInfoByJan(code);
      setProduct(result);
      setLoading(false);
    };

    loadProduct();
  }, [code]);

  return (
    <div style={{ padding: 24 }}>
      <h2>バーコードスキャンテスト</h2>

      {/* バーコードスキャナー起動 */}
      <BarcodeScanner onDetect={(detectedCode) => setCode(detectedCode)} />
      
      {/* スキャン結果を表示 */}
      {code && <p>スキャン結果: {code}</p>}

      {/* 読み込み中 */}
      {loading && <p>商品情報取得中...</p>}

      {/* 商品情報が取得できた場合 */}
      {product && (
        <div style={{ marginTop: 16 }}>
          <h3>{product.name}</h3>

          {product.image_url && (
            <Image
              src={product.image_url}
              alt="商品画像"
              width={120}
              height={120}
              style={{ objectFit: 'contain' }}
            />
          )}

          <p>JANコード: {product.jan_code}</p>
        </div>
      )}

      {/* 取得できなかった場合 */}
      {code && !loading && !product && (
        <p style={{ color: 'red' }}>商品情報が見つかりませんでした。</p>
      )}
    </div>
  );
}