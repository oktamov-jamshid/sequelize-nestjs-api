import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Products } from 'src/products/products.model';
import { Users } from 'src/users/users.model';
import { Orders } from './orders.model';

@Module({
  imports: [SequelizeModule.forFeature([Products, Users, Orders])],
  exports: [OrdersService],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
