import { Controller, Get, Param } from '@nestjs/common';
import { CsvService } from '../shared/csv.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('plot')
export class PlotController {

  public constructor(private readonly csvService: CsvService) {}

  @Get('scatter/:x/:y')
  public scatter(
    @Param('x') xcolumn: string,
    @Param('y') ycolumn: string,
  ): Observable<{ data: Array<{ x: number, y: number }> }> {
    return this.csvService.getValuePairs(xcolumn, ycolumn).pipe(
      map(array => array.map(o => ({ x: Number(o.ping), y: Number(o.pong) }))),
      map(o => ({ data: o })),
    );
  }

  @Get('distribution/:name/:count')
  public distribution(
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
