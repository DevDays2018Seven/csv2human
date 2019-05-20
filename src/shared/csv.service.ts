import { Injectable } from '@nestjs/common';

@Injectable()
export class CsvService {

  private csv: object[] = [{ one: 1, two: 2, three: 3 }, { one: 4, two: 5, three: 6 }];

  public getCsv(): string {
    if (this.csv) { return JSON.stringify(this.csv); }
  }
}
