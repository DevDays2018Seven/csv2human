import { Controller, Get, Param, Post } from '@nestjs/common';
import { CsvService } from '../shared/csv.service';
import { Observable, of } from 'rxjs';

@Controller('csv')
export class CsvController {

  public constructor(private readonly csvService: CsvService) {
  }

  @Get()
  public csv(): Observable<string[]> {
    return this.csvService.getCsvFileNames();
  }

  @Post(':fileName')
  public setCsv(
    @Param('fileName') fileName: string,
  ): void {
    this.csvService.setSelectedCsv(fileName);
  }
}
