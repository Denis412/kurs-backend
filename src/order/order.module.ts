import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from 'src/user/user.module';
import { DirectionModule } from 'src/direction/direction.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UserModule, DirectionModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
