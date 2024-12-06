import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Users } from 'src/users/users.model';

@Table({ tableName: 'payments' })
export class Payments extends Model<Payments> {
  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  payment_date: Date;

  @Column({
    type: DataType.ENUM('pending', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status: 'pending' | 'completed' | 'failed';

  @BelongsTo(() => Users)
  user: Users
}
