import { Controller, Get, Param, Query } from '@nestjs/common';
import { CsvService } from '../shared/csv.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { calcMax, calcMin } from '../shared/helper.function';

@Controller('plot')
export class PlotController {

  public constructor(private readonly csvService: CsvService) {}

  @Get('scatter/:x/:y')
  public scatter(
    @Param('x') xcolumn: string,
    @Param('y') ycolumn: string,
    @Query('outlier') outlier: string,
  ): Observable<{ data: Array<{ x: number, y: number }> }> {
    return this.csvService.getValuePairs(xcolumn, ycolumn).pipe(
      map(array => array.map(o => ({ x: Number(o.ping), y: Number(o.pong) }))),
      map(array => {
        if (outlier === 'dixon-q') {
          const xFilter = PlotController.dixonQTest(array.map(value => value.x));
          const yFilter = PlotController.dixonQTest(array.map(value => value.y));
          return array.filter(value => xFilter.includes(value.x) && yFilter.includes(value.y));
        } else {
          return array;
        }
      }),
      map(o => ({ data: o })),
    );
  }

  @Get('distribution/:name/:count')
  public distribution(
    @Param('name') name: string,
    @Param('count') count: string,
    @Query('outlier') outlier: string,
  ): Observable<{ data: number[], labels: string[] }> {
    const numericalCount: number = Number(count);

    return this.csvService.getColumn(name).pipe(
      map(value => value.map(entry => Number(entry))),
      map(o => outlier === 'dixon-q' ? PlotController.dixonQTest(o) : o),
      map(value => {
        const data: number[] = [...new Array<number>(numericalCount)].map(_ => 0);

        const filterNaN = value.filter(v => !isNaN(v));

        const max: number = calcMax(filterNaN);
        const min: number = calcMin(filterNaN);

        const width = (max - min) / numericalCount;

        filterNaN.forEach(entry => {
          data[Math.min(numericalCount - 1, Math.floor((entry - min) / width))]++;
        });

        const labels: string[] = [...new Array(numericalCount)].map((_, index) => {
          return `< ${Math.floor((index + 1) * width)}`;
        });

        return { data, labels };
      }),
    );
  }

  private static dixonQTest(numbers: number[]): number[] {
    const sortedDistinct = [...new Set(numbers)].sort((a, b) => a - b);

    const filtered = numbers.filter(value => {
      if (value > sortedDistinct[0] && value < sortedDistinct[sortedDistinct.length - 1]) {
        return false;
      }

      const gap = value === sortedDistinct[0] ?
        Math.abs(value - sortedDistinct[1]) :
        Math.abs(value - sortedDistinct[sortedDistinct.length - 2]);

      const range = value === sortedDistinct[0] ?
        Math.abs(value - sortedDistinct[sortedDistinct.length - 1]) :
        Math.abs(value - sortedDistinct[0]);

      // Dixon Q test with Q_table of 0.5
      return gap / range > 0.5;
    });

    return filtered.length > 0 ?
      this.dixonQTest(numbers.filter(value => !filtered.includes(value))) :
      numbers;
  }
}
