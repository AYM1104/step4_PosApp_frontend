// カメラを起動してバーコードを読み取り、結果を親コンポーネントに渡すコンポーネント

'use client';

import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';

// BarcodeScanner コンポーネントに渡す「propsの型」を定義
type Props = {
  onDetect: (code: string) => void;
};




export default function BarcodeScanner({ onDetect }: Props) {

    // 変数の宣言
    const videoRef = useRef<HTMLVideoElement>(null);    // HTMLのvideoタグを入れる箱
    const controlsRef = useRef<IScannerControls | null>(null);
    const lastDetectedTimeRef = useRef<number>(0);
    const lastDetectedCodeRef = useRef<string | null>(null);
    const isScanningRef = useRef<boolean>(true); // ✅ スキャン制御用フラグ


    // コンポーネントを読み込んだ時 に実行する処理
    useEffect(() => {
        // ① 読み取り器の作成
        const reader = new BrowserMultiFormatReader();

        // ② カメラを起動して読み取り開始
        reader.decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
        if (!result) return; // バーコードが読めなかったら何もしない

        const code = result.getText(); // バーコードの文字列を取得
        const now = Date.now();

        // 3秒以内かつ同じコードはスキップ
        if (
        (code === lastDetectedCodeRef.current && now - lastDetectedTimeRef.current < 3000)
        ) {
            return;
        }

        lastDetectedCodeRef.current = code;
        lastDetectedTimeRef.current = now;

        // ✅ ビープ音再生（任意）
      new Audio('/sound/barcode.mp3').play().catch((e) => console.warn("音声エラー", e));

        isScanningRef.current = false; // ✅ スキャン停止フラグ

    
        // 読み取ったコードを親へ渡す
        onDetect(code);
        // ✅ 3秒後にスキャン再開
        setTimeout(() => {
            isScanningRef.current = true;
        }, 3000);
      }).then((controls) => {
        controlsRef.current = controls;
      }).catch((err) => {
        console.warn('[⚠️ スキャンエラー]', err);
      });


       // ④ 終了時にカメラを停止（コンポーネントが消えたとき）
      return () => {
        controlsRef.current?.stop();
      };
    });

    //  UI部分
    return (
        <div
        style={{
            position: 'relative',
            width: '100%',
            maxWidth: 320,
            aspectRatio: '4 / 3',
            margin: '0 auto',
            borderRadius: 8,
            overflow: 'hidden',
        }}
        >
        {/* 📷 カメラ映像 */}
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            }}
        />

        {/* 🕶️ グレーアウトオーバーレイ */}
        <div
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            clipPath: `
                polygon(
                0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
                10% 30%, 10% 70%, 90% 70%, 90% 30%, 10% 30%
                )
            `,
            }}
        />

        {/* ⬜ コーナー */}
        {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((corner) => {
            const styles: Record<string, React.CSSProperties> = {
            topLeft: { top: '30%', left: '10%', borderTop: '4px solid white', borderLeft: '4px solid white' },
            topRight: { top: '30%', right: '10%', borderTop: '4px solid white', borderRight: '4px solid white' },
            bottomLeft: { bottom: '30%', left: '10%', borderBottom: '4px solid white', borderLeft: '4px solid white' },
            bottomRight: { bottom: '30%', right: '10%', borderBottom: '4px solid white', borderRight: '4px solid white' },
            };
            return (
            <div
                key={corner}
                style={{
                position: 'absolute',
                width: 24,
                height: 24,
                ...styles[corner],
                borderRadius: 4,
                pointerEvents: 'none',
                }}
            />
            );
        })}
        </div>
  );
}