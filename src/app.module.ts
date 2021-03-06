import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeadersController } from './headers/headers.controller';
import { CsvService } from './shared/csv.service';
import { AverageController } from './average/average.controller';
import { PlotController } from './plot/plot.controller';
import { CsvController } from './csv/csv.controller';

@Module({
  imports: [],
  controllers: [AppController, HeadersController, AverageController, PlotController, CsvController],
  providers: [AppService, CsvService],
})
export class AppModule {
}
