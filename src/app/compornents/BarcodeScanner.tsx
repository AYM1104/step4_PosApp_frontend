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
      new Audio('/sound/beep.mp3').play().catch((e) => console.warn("音声エラー", e));

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
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{ width: '100%', maxWidth: '480px', borderRadius: '8px' }}
    />
  );
}