import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CsvService } from '../shared/csv.service';

@Controller('headers')
export class HeadersController {

  public constructor(private readonly csvService: CsvService) {}

  @Get()
  public headers(): Observable<string[]> {
    return this.csvService.getHeaders();
  }
}
