import { Controller, Get, Query, BadRequestException } from '@nestjs/common';

import { CsvService } from '../shared/csv.service';
import { Observable, of } from 'rxjs';

@Controller('average')
export class AverageController {

  public constructor(private readonly csvService: CsvService) { }

  @Get()
  // public async average(@Param('column') column: string): Promise<number> {
  public average(@Query('column') column: string, @Query('type') type: string): Observable<number> {
    if (!column) {
      throw new BadRequestException('Column name is not specified.');
    }

    return of(AverageController.calculateAverage([1, 2, 2, 3, 4, 7, 9], 'arithmetic-mean'));
  }

  private static calculateAverage(numbers: number[], type: string): number {
    return 43;
  }
}
