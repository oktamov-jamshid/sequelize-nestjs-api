import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharingModule } from './common/shering.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      username: 'postgres',
      password: '123456',
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    ProductsModule,
    PaymentsModule,
    OrdersModule,
    SharingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
