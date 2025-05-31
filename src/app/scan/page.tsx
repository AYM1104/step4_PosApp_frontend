// バーコードをスキャンすると商品情報が表示されるページ

'use client'

import { useState, useEffect } from "react";
import BarcodeScanner from '../compornents/BarcodeScanner';
import { fetchProductFromDB } from "@/lib/fetchProductFromDB";
import { Product } from "@/types/product";
import { Button, Card, CardContent, Typography, CardMedia } from '@mui/material';

export default function ScanPage() {
    const [code, setCode] = useState<string>("");   // スキャンされたコード
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);   // 商品情報

    // JANコードが更新されたら商品情報を取得
    useEffect(() => {
        if (!code) return;

        fetchProductFromDB(code).then((data) => {
            if (data) {
                setProduct(data);
            } else {
                setProduct(null); // 見つからない場合はnullにリセット
            }
        });
    }, [code]);

    return (
        <div style={{ padding: 24 }}>
            <h2>商品をスキャンしてカードに追加するページ</h2>
            <Button variant="contained" onClick={() => setIsScannerOpen(true)}>
                スキャンを開始する
            </Button>

            {/* isScannerOpen = trueの時だけカメラを表示 */}
            {isScannerOpen && (
                <div style={{ marginBottom: 16 }}>
                    <BarcodeScanner
                    onDetect={(code) => {
                        setCode(code);
                    }}
                    />
                </div>
            )}

            {/* スキャン結果の表示 */}
            {code && <p>スキャン結果: {code}</p>}

            {/* 商品情報の表示 */}
            {product && (
                <Card sx={{ maxWidth: 400, mt: 2 }}>
                    {product.image_url && (
                        <CardMedia
                            component="img"
                            height="140"
                            image={product.image_url}
                            alt={product.name}
                        />
                    )}
                    <CardContent>
                        <Typography variant="body2">商品名: {product.name}</Typography>
                        <Typography variant="body2">価格: ¥{product.price}</Typography>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}