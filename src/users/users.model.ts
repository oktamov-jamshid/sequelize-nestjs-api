import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Orders } from 'src/orders/orders.model';
import { Payments } from 'src/payments/payments.model';

@Table({ tableName: 'users' })
export class Users extends Model<Users> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM('addmin', 'worker', 'user'),
    allowNull: false,
    unique: true,
  })
  role: 'admin' | 'worker' | 'user';

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  salary?: number;

  @HasMany(() => Orders)
  orders: Orders[];

  @HasMany(() => Payments)
  payments: Payments[];

  //   salary?: number, // salary parametrini qo'shamiz
  // ): Promise<User> {
  //   // Agar foydalanuvchi 'admin' yoki 'worker' bo'lsa, salary qo'shish mumkin
  //   if (role === 'admin' || role === 'worker') {
  //     return this.userModel.create({ name, email, password, role, salary });
  //   }

  //   // Agar 'user' roli bo'lsa, maoshni qo'ymaslik
  //   return this.userModel.create({ name, email, password, role });
}
