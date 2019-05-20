import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as glob from 'glob';
import * as csvParser from 'csv-parser';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CsvService {

  private csv: object[] = [];
  private selectedCsv: string;
  private fileNames: string[] = [];

  public getHeaders(): Observable<string[]> {
    return this.getCsv().pipe(map(array => Object.keys(array[0])));
  }

  public getColumn(name: string): Observable<string[]> {
    return this.getCsv().pipe(map(array => array.map(entry => entry[name])));
  }

  public getValuePairs(column1: string, column2: string): Observable<Array<{ ping: string, pong: string }>> {
    return this.getCsv().pipe(map(array => array.map(entry => ({
      ping: entry[column1],
      pong: entry[column2],
    }))));
  }

  public getCsvFileNames(): Observable<string[]> {
    if (this.fileNames.length !== 0) {
      return of(this.fileNames);
    }

    return from(new Promise<string[]>((resolve, reject) => {
      glob('resources/*.csv', (error, files) => {
        if (error) {
          reject(error);
        }
        this.fileNames = files;
        resolve(this.fileNames);
      });
    }));
  }

  public setSelectedCsv(name: string): void {
    this.selectedCsv = name;
  }

  private getCsv(): Observable<object[]> {
    if (this.selectedCsv) {
      return from(new Promise<object[]>((resolve, reject) => {
        createReadStream(this.selectedCsv)
          .pipe(csvParser())
          .on('data', chunk => this.csv.push(chunk))
          .on('end', () => resolve(this.csv))
          .on('error', err => reject(err));
      }));
    }
    return of();
  }
}
