import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeadersController } from './headers/headers.controller';
import { CsvService } from './shared/csv.service';
import { ColumnsController } from './columns/columns.controller';
import { AverageController } from './average/average.controller';
import { PlotController } from './plot/plot.controller';

@Module({
  imports: [],
  controllers: [AppController, HeadersController, ColumnsController, AverageController, PlotController],
  providers: [AppService, CsvService],
})
export class AppModule {}
