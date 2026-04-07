import { Module } from '@nestjs/common';
import { HrService } from './services/hr.service';
import { HrController } from './controllers/hr.controller';

@Module({
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}
