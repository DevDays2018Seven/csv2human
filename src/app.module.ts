import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeadersController } from './headers/headers.controller';
import { CsvService } from './shared/csv.service';
import { AverageController } from './average/average.controller';

@Module({
  imports: [],
  controllers: [AppController, HeadersController, AverageController],
  providers: [AppService, CsvService],
})
export class AppModule {}
