'use client';

import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';

type Props = {
  onDetect: (code: string) => void;
};

export default function BarcodeScanner({ onDetect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastDetectedTimeRef = useRef<number>(0);
  const lastDetectedCodeRef = useRef<string | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    reader.decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
      if (!result) return;

      const code = result.getText();
      const now = Date.now();

      // 3秒以内かつ同じコードはスキップ
      if (
        code === lastDetectedCodeRef.current &&
        now - lastDetectedTimeRef.current < 3000
      ) {
        return;
      }

      lastDetectedCodeRef.current = code;
      lastDetectedTimeRef.current = now;

      // ✅ ビープ音再生（任意）
      new Audio('/sound/barcode.mp3').play().catch((e) => console.warn("音声エラー", e));

      console.log('[📸 Detected]', code);
      onDetect(code);
    }).then((controls) => {
      controlsRef.current = controls;
    }).catch((err) => {
      console.warn('[⚠️ スキャンエラー]', err);
    });

    // コンポーネントアンマウント時にカメラ停止
    return () => {
      controlsRef.current?.stop();
    };
  }, [onDetect]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
      {/* 📷 カメラ映像 */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '100%', maxWidth: '480px', borderRadius: '8px' }}
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

      {/* ⬜ コーナー（4つ） */}
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
