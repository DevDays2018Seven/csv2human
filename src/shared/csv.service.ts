import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as glob from 'glob';
import * as csvParser from 'csv-parser';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CsvService {

  private csv: object[] = [];

  public getHeaders(): Observable<string[]> {
    return this.getCsv().pipe(map(array => Object.keys(array[0])));
  }

  public getColumn(name: string): Observable<string[]> {
    return this.getCsv().pipe(map(array => array.map(entry => entry[name])));
  }

  private getCsv(): Observable<object[]> {
    if (this.csv.length !== 0) { return of(this.csv); }

    return from(new Promise<object[]>((resolve, reject) => {
      glob('resources/*.csv', (error, files) => {
        if (error) { reject(error); }

        createReadStream(files[0])
          .pipe(csvParser())
          .on('data', chunk => this.csv.push(chunk))
          .on('end', () => resolve(this.csv))
          .on('error', err => reject(err));
      });
    }));
  }

}
