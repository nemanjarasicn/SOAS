import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from './constants.service';
import {Observable} from 'rxjs';
import {TranslateItPipe} from '../shared/pipes/translate-it.pipe';
import {MessagesService} from "./messages.service";

@Injectable({
  providedIn: 'root'
})
export class CsvImportService {

  tableName = 'csvImports';

  private translatePipe: TranslateItPipe

  constructor(
    private http: HttpClient,
    private CONSTANTS: ConstantsService,
    private messagesService: MessagesService) {
  }

  getHeaders() {
    return {headers: {Authorization: 'Bearer ' + localStorage.getItem(this.CONSTANTS.LS_ACCESS_TOKEN)}};
  }

  setTranslatePipe(pipe: TranslateItPipe) {
    this.translatePipe = pipe;
    this.messagesService.setTranslatePipe(this.translatePipe);
  }

  importCsvFile(params: { template: string, file: File }): Promise<void> {
    const url = this.CONSTANTS.SERVER_URL + '/csvImport';

    const formData = new FormData();
    formData.append('template', params.template);
    formData.append('file', params.file);

    return this.http.post(url, formData).toPromise().then(
      (res: { result: string, error: string }) => {
        if (res.result === 'OK') {
          const description = 'CSV Import';
          const text = `Import of ${params.file.name} has been completed successfully.`
          this.messagesService.showInfoDialog(this.messagesService, description, text);
        } else {
          // something wrong
          const description = 'CSV Import ERROR';
          const text = res.error
          this.messagesService.showInfoDialog(this.messagesService, description, text);
        }
      }
    )

  }

  getCsvTypes(): Observable<Array<{ id: number, label: string }> | false> {
    return this.http.post<Array<{ id: number, label: string }> | false>(
      this.CONSTANTS.SERVER_URL + '/csvGetImportTypes',
      {},
      {...this.getHeaders()}
    )
  }

  getTemplateConfigs(id: number): Observable<Array<{ id: number, label: string }> | false> {
    return this.http.post<Array<{ id: number, label: string }> | false>(
      this.CONSTANTS.SERVER_URL + '/csvGetTemplateConfigs',
      {
        id
      },
      {...this.getHeaders()}
    )
  }

}
