import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CsvService } from '../shared/csv.service';

@Controller('columns')
export class ColumnsController {

  public constructor(private readonly csvService: CsvService) {}

  @Get(':name/:count')
  public column(
    @Param('name') name: string,
    @Param('count') count: string,
  ): Observable<{ data: number[], labels: string[] }> {
    const numericalCount: number = Number(count);

    return this.csvService.getColumn(name).pipe(
      map(value => value.map(entry => Number(entry))),
      map(value => {
        const data: number[] = [...new Array<number>(numericalCount)].map(_ => 0);

        const filterNaN = value.filter(v => !isNaN(v));

        const max: number = Math.max(...filterNaN);
        const min: number = Math.min(...filterNaN);

        const width = (max - min) / numericalCount;

        filterNaN.forEach(entry => {
          data[Math.min(numericalCount - 1, Math.floor((entry - min) / width))]++;
        });

        const labels: string[] = [...new Array(numericalCount)].map((_, index) => {
          return `< ${Math.floor((index + 1) * width)}`;
        });

        return {data, labels};
      }),
    );
  }

}
