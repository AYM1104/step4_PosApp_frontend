'use client';

import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

type Props = {
  onDetect: (code: string) => void;
};

export default function BarcodeScanner({ onDetect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    const controls = codeReader.decodeFromVideoDevice(
      undefined,
      videoRef.current!,
      (result) => {
        if (result) {
          onDetect(result.getText());
          controls.then((c) => c.stop()); // 読み取り後に停止
        }
      }
    );

    return () => {
      controls.then((c) => c.stop()); // アンマウント時に停止
    };
  }, [onDetect]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      style={{ width: '100%', maxWidth: '480px', borderRadius: '8px' }}
    />
  );
}