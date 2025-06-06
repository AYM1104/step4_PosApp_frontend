// 'use client';

// import { Box, Stepper, Step, StepLabel } from '@mui/material';
// import { useState } from 'react';

// // 各ステップ内に配置する画面をインポート
// import ProductScanComponent from './compornents/steps/ProductScanComponent';


// // ステップ項目を定義
// const steps = ['商品スキャン', 'お会計', 'レシート発行'];

// export default function StyledStepperContainer() {
//   const [activeStep, setActiveStep] = useState(0);

//   return (
//     // 全体の枠
//     <Box
//       sx={{
//         backgroundColor: '#2f4260', // 背景（外側） navy-like
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         p: 2,
//       }}
//     >
//       {/* 内側の枠 */}
//       <Box
//         sx={{
//           backgroundColor: '#fff', // 内側グレー
//           borderRadius: '16px',
//           // width: '98%',
//           minWidth: '150vh',
//           minHeight: '90vh',
//           p: 4,
//           boxShadow: 3,
//         }}
//       >
//         {/* ステップバー */}
//         <Box>
//           <Stepper activeStep={1} alternativeLabel>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Box>
        
//         {/* ステップの中身 */}
//         <Box sx={{ minHeight: '60vh' }}>
//           {activeStep === 0 && <ProductScanComponent />}
//         </Box>
//       </Box>
//     </Box>
//   );
// }