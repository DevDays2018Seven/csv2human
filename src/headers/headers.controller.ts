import { Controller, Get } from '@nestjs/common';
import { CsvService } from '../shared/csv.service';

@Controller('headers')
export class HeadersController {

  public constructor(private readonly csvService: CsvService) {}

  @Get()
  public headers(): object {
    return JSON.parse(this.csvService.getCsv());
  }
}
