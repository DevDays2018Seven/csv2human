import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeadersController } from './headers/headers.controller';
import { CsvService } from './shared/csv.service';

@Module({
  imports: [],
  controllers: [AppController, HeadersController],
  providers: [AppService, CsvService],
})
export class AppModule {}
