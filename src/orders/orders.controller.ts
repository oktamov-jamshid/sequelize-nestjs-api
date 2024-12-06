import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/common/auth/role.decarator';
import { RoleGuard } from 'src/common/auth/role.guard';
import { AuthGuard } from 'src/common/auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.ordersService.create(
        createOrderDto.user_id,
        createOrderDto.product_id,
        createOrderDto.quantity,
      )
      return {message : 'order created successfully', order}
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException('order created failed', error.message)
      
    }
  }

  @Get('user/:id') // Route: /orders/user/:user_id
  async getOrdersByUser(@Param('id') user_id: number) {
    try {
      const orders = await this.ordersService.getOrdersByUser(user_id);
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders for user: ${error.message}`);
    }
  }


  @Get()
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
