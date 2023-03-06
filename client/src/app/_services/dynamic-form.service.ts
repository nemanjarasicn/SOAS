import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {SoasModel} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  private activeForm$ = new BehaviorSubject<any>(null) //TODO add interface for form
  private activeFields$ = new BehaviorSubject<FormlyFieldConfig[]>([])
  private activeModel$ = new BehaviorSubject<SoasModel>(null)

  constructor() { }

  subscribeToActiveForm(): Observable<any>{ //TODO add interface for form
    return this.activeForm$
  }

  setActiveForm(value: any): void { //TODO add interface for form
    this.activeForm$.next(value)
  }

  subscribeToActiveFields(): Observable<FormlyFieldConfig[]>{
    return this.activeFields$
  }

  setActiveFields(value: FormlyFieldConfig[]): void {
    this.activeFields$.next(value)
  }

  subscribeToActiveModel(): Observable<SoasModel>{
    return this.activeModel$
  }

  setActiveModel(value: SoasModel): void {
    this.activeModel$.next(value)
  }
}
