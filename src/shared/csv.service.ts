import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as glob from 'glob';
import * as csvParser from 'csv-parser';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CsvService {

  private csv: object[] = [];

  public getHeaders(): Promise<string[]> {
    return this.getCsv().then(array => Object.keys(array[0]));
  }

  public getColumn(name: string): Observable<string[]> {
    return of([{ one: 1, two: 2 }, { one: 1, two: 2 }, { one: 1, two: 2 }]).pipe(map(value => value['one']));
  }

  private getCsv(): Promise<object[]> {
    if (this.csv.length !== 0) { return Promise.resolve((this.csv)); }

    return new Promise<object[]>((resolve, reject) => {

      glob('resources/*.csv', (error, files) => {
        if (error) { reject(error); }

        createReadStream(files[0])
          .pipe(csvParser())
          .on('data', chunk => this.csv.push(chunk))
          .on('end', () => resolve(this.csv))
          .on('error', err => reject(err));
      });
    });
  }
}
