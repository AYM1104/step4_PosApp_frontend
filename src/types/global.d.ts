// ブラウザやNode.jsなど、グローバルに存在する機能（window や document など）に対する型定義

export {};

declare global {
  interface Window {
    BarcodeDetector?: typeof BarcodeDetector;
  }

  class BarcodeDetector {
    constructor(options?: { formats: string[] });
    detect(video: HTMLVideoElement): Promise<{ rawValue: string }[]>;
  }
}