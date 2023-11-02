import { Injectable } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { PawnedLogItem } from 'src/app/models/pawned-logs.model';
import { Subject } from 'rxjs';
import { LoadingSpinnerService } from '../loading-spinner.service';

@Injectable({
  providedIn: 'root'
})
export class LogTableService  {

  logDataSubject: Subject<PawnedLogItem[]> = new Subject<PawnedLogItem[]>();
  logData: PawnedLogItem[] = []
  private intialDataCount: number=50;

  constructor(private api: RestApiService) {
    this.getNDataForTable(this.intialDataCount);
   }

   public  getNDataForTable(count: number) {
    this.api.getNLogs(count).subscribe((response: PawnedLogItem[]) => {
      this.logData= response;
      
      this.logDataSubject.next(this.logData);

      console.log(response);
      
    },
      (error: any) => {
        console.error(error);
      }

    )

  
  }
  getData(): PawnedLogItem[] {
    return this.logData;
  }


}