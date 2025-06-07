// src/app/compornents/CartTable.tsx
'use client';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button} from '@mui/material';
import { CartItem } from '@/types/product';

type Props = {
  items: CartItem[];
  onDelete: (janCode: string) => void;
};

export default function CartTable({ items, onDelete }: Props) {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ p: 2 }}>
        カートに追加された商品
      </Typography>
      <Table>
        <TableHead sx={{ backgroundColor: '#e0f2f1' }}>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>商品名称</TableCell>
            <TableCell>数量</TableCell>
            <TableCell>価格</TableCell> 
            <TableCell>小計</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={`${item.jan_code}-${index}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>¥{item.price.toLocaleString()}</TableCell>
              <TableCell>¥{(item.price * item.quantity).toLocaleString()}</TableCell>
              <TableCell><Button variant="outlined" color="error" onClick={() => onDelete(item.jan_code)}>削除</Button></TableCell>
            </TableRow>
          ))}
          {items.length > 0 ? (
            <TableRow>
              <TableCell colSpan={2}>合計</TableCell>
              <TableCell>{items.reduce((sum, item) => sum + item.quantity, 0)} 点</TableCell>
              <TableCell><span style={{ display: 'none' }}>空</span></TableCell>
              <TableCell>¥{items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}（税抜）</TableCell>
              <TableCell>¥{Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.1).toLocaleString()}（税込）</TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}