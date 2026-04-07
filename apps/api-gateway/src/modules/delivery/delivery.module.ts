import { Module } from '@nestjs/common';
import { DeliveryService } from './services/delivery.service';
import { DeliveryController } from './controllers/delivery.controller';

@Module({
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
