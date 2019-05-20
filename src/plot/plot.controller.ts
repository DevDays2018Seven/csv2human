import { Controller, Get, Param } from '@nestjs/common';
import { CsvService } from '../shared/csv.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  ): Observable<{ data: Array<{ x: number, y: number }> }> {
    return this.csvService.getValuePairs(xcolumn, ycolumn).pipe(
      map(array => array.map(o => ({ x: Number(o.ping), y: Number(o.pong) }))),
      map(o => ({ data: o })),
    );
  }
}
