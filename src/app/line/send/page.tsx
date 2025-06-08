import { Suspense } from 'react';
import LineSendPage from '../page';

export default function LineSendWrapperPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <LineSendPage />
    </Suspense>
  );
}