import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CsvService } from '../shared/csv.service';

@Controller('average')
export class AverageController {

  public constructor(private readonly csvService: CsvService) { }

  @Get()
  public average(@Query('column') column: string, @Query('type') type: string): Observable<number> {
    if (!column) {
      throw new BadRequestException('Column name is not specified.');
    }

    return this.csvService.getColumn(column).pipe(
      map(value => value.map(entry => Number(entry))),
      map(value => AverageController.calculateAverage(value, type)),
    );
  }

  private static calculateAverage(numbers: number[], type: string): number {
    const filteredNumbers: number[] = numbers.filter(value => !isNaN(value));

    if (filteredNumbers.length === 0) {
      throw new BadRequestException(`Column contains only non numeric values.`);
    }

    // Default average type
    if (type === undefined) { type = 'arithmetic-mean'; }

    const dict: { [key: string]: (numbers: number[]) => number; } = {};
    dict['arithmetic-mean'] = AverageController.calculateArithmeticMean;
    dict.median = AverageController.calculateMedian;
    dict['mid-range'] = AverageController.calculateMidRange;

    if (Object.keys(dict).filter(value => value === type).length === 0) {
      throw new BadRequestException(`Type ${type} is not a known average type.`);
    }

    return dict[type](filteredNumbers);
  }

  private static calculateArithmeticMean(numbers: number[]): number {
    return numbers.reduce((prev, cur) => prev + cur) / numbers.length;
  }

  private static calculateMedian(numbers: number[]): number {
    return numbers.slice(numbers.length / 2)[0];
  }

  private static calculateMidRange(numbers: number[]): number {
    return (Math.max(...numbers) + Math.min(...numbers)) / 2;
  }
}
