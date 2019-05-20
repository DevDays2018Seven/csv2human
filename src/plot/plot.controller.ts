import { Controller, Get, Param, Query } from '@nestjs/common';
import { CsvService } from '../shared/csv.service';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Controller('plot')
export class PlotController {

  public constructor(private readonly csvService: CsvService) {}

  @Get('distribution/:name/:count')
  public column(
    @Param('name') name: string,
    @Param('count') count: string,
  ): Observable<string[]> {
    return this.csvService.getColumn(name);
  }

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
