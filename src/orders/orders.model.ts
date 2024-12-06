// Table orders {
//     id          int [pk, increment]
//     user_id     int [ref: > users.id]
//     product_id  int [ref: > products.id]
//     quantity    int
//     total_price decimal(10, 2)
//     created_at  timestamp [default: now()]
//   }

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Products } from 'src/products/products.model';
import { Users } from 'src/users/users.model';

@Table({ tableName: 'orders' })
export class Orders extends Model<Orders> {
  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @ForeignKey(() => Products)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  total_price: string;

  @BelongsTo(() => Users)
  user: Users;

  @BelongsTo(() => Products)
  product: Products;
}
