import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/common/auth/role.decarator';
import { RoleGuard } from 'src/common/auth/role.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('admin')
  @UseGuards(RoleGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get(':id/stock')
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  checkProductStock(@Param('id') id: string) {
    return this.productsService.checkProductStock(+id);
  }

  @Get()
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
