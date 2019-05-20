import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';

@Injectable()
export class CsvService {

  private csv: object[] = [];

  public getCsv(): Promise<object[]> {
    if (this.csv.length !== 0) { return Promise.resolve((this.csv)); }

    return new Promise<object[]>((resolve, reject) => {
      createReadStream('resources/scotch_review.csv')
        .pipe(csvParser())
        .on('data', chunk => this.csv.push(chunk))
        .on('end', () => resolve(this.csv))
        .on('error', err => reject(err));
    });
  }
}
