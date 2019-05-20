import { Controller, Get } from '@nestjs/common';
import { CsvService } from '../shared/csv.service';

@Controller('headers')
export class HeadersController {

  public constructor(private readonly csvService: CsvService) {}

  @Get()
  public async headers(): Promise<object[]> {
    return await this.csvService.getCsv();
  }
}
