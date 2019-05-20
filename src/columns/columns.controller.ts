import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CsvService } from '../shared/csv.service';

@Controller('columns')
export class ColumnsController {

  public constructor(private readonly csvService: CsvService) {}

  @Get(':name/:count')
  public column(
    @Param('name') name: string,
    @Param('count') count: string,
  ): Observable<string[]> {
    return this.csvService.getColumn(name);
  }

}
