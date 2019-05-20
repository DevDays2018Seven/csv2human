import { Injectable, OnModuleInit } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as glob from 'glob';
import * as csvParser from 'csv-parser';
import { from, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class CsvService implements OnModuleInit {

  private csv: object[] = [];
  private selectedCsv: string;
  private fileNames: string[] = [];

  public onModuleInit(): void {
    this.loadFiles().pipe(take(1)).subscribe();
  }

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
  }

  public setSelectedCsv(name: string): void {
    this.selectedCsv = name;
  }

  private getCsv(): Observable<object[]> {
    return from(new Promise<object[]>((resolve, reject) => {
      createReadStream(this.selectedCsv || this.fileNames[0])
        .pipe(csvParser())
        .on('data', chunk => this.csv.push(chunk))
        .on('end', () => resolve(this.csv))
        .on('error', err => reject(err));
    }));
  }

  private loadFiles(): Observable<void> {
    return from(new Promise<void>((resolve, reject) => {
      glob('resources/*.csv', (error, files) => {
        if (error) {
          reject(error);
        }
        this.fileNames = files;
        resolve();
      });
    }));
  }
}
