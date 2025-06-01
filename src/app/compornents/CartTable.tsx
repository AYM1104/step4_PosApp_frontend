// src/app/compornents/CartTable.tsx
'use client';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { CartItem } from '@/types/product';

type Props = {
  items: CartItem[];
  onDelete: (janCode: string) => void;
};

export default function CartTable({ items, onDelete }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#e0f2f1' }}>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>商品名称</TableCell>
            <TableCell>数量</TableCell>
            <TableCell>金額</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={`${item.jan_code}-${index}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>¥{item.price?.toLocaleString()}</TableCell>
              <TableCell>
                <button onClick={() => onDelete(item.jan_code)}>削除</button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2}>合計</TableCell>
            <TableCell>
              {/* 点数（合計数量）を表示 */}
              {items.reduce((sum, item) => sum + item.quantity, 0)} 点
            </TableCell>
            <TableCell>
              {/* 合計金額を表示 */}
              ¥{items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}