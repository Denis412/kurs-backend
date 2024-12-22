import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: any) {
    return this.orderService.create({
      ...createOrderDto,
      user_id: user.userId,
    });
  }

  @Get('check/:directionId')
  checkDirectionOrder(
    @Param('directionId') directionId: string,
    @GetUser() user: any,
  ) {
    return this.orderService.checkOrderDirection(+directionId, +user.userId);
  }

  @Get('admin')
  findAllAdmin() {
    return this.orderService.findAllAdmin();
  }

  @Get()
  findAllByUserId(@GetUser() user: any) {
    return this.orderService.findAllByUserId(+user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
