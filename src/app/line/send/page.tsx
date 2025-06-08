import { Suspense } from 'react';
// import LineSendPage from '../page';
import LineSendContent from './LineSendContent';

export const dynamic = 'force-dynamic';

export default function LineSendWrapperPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <LineSendContent />
    </Suspense>
  );
}