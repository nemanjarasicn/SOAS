import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {SoasModel} from "./constants.service";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {IShowTogether} from "../interfaces/dynamic-view-main-table.interface";

@Injectable({
  providedIn: 'root'
})
export class DynamicTableService {
  private _dataSource$ = new BehaviorSubject<SoasModel[]>([])
  private _displayedColumns$ = new BehaviorSubject<string[]>([])
  private _formlyConfig$ = new BehaviorSubject<FormlyFieldConfig[]>([])
  private _title$ = new BehaviorSubject<string>('')
  private _referenceColumn$ = new BehaviorSubject<string>('')
  private _referenceValue$ = new BehaviorSubject<string>('')
  private _refTable$ = new BehaviorSubject<string>('')
  private _showTogether$ = new BehaviorSubject<IShowTogether[]>([])
  private _pk$ = new BehaviorSubject<string | undefined>(undefined)


  constructor() { }

  getDataSource(): Observable<SoasModel[]> {
    return this._dataSource$
  }

  getDisplayedColumns(): Observable<string[]> {
    return this._displayedColumns$
  }

  getFormlyConfig(): Observable<FormlyFieldConfig[]> {
    return this._formlyConfig$
  }

  getTitle(): Observable<string> {
    return this._title$
  }

  getRefTable(): Observable<string> {
    return this._refTable$
  }

  getReferenceColumn(): Observable<string> {
    return this._referenceColumn$
  }

  getReferenceValue(): Observable<string> {
    return this._referenceValue$
  }

  getShowTogether(): Observable<IShowTogether[]> {
    return this._showTogether$
  }

  setShowTogether(v: IShowTogether[]): void {
    this._showTogether$.next(v)
  }

  getPk(): Observable<string | undefined> {
    return this._pk$
  }

  setPk(v: string | undefined): void {
    this._pk$.next(v)
  }

  setDataSource(v: SoasModel[]): void {
    this._dataSource$.next(v)
  }

  setDisplayedColumns(v: string[]): void {
    this._displayedColumns$.next(v)
  }

  setFormlyConfig(v: FormlyFieldConfig[]): void {
    this._formlyConfig$.next(v)
  }

  setTitle(v: string): void {
    this._title$.next(v)
  }

  setReferenceColumn(v: string): void {
    this._referenceColumn$.next(v)
  }

  setReferenceValue(v: string): void {
    this._referenceValue$.next(v)
  }

  setRefTable(v: string): void {
    this._refTable$.next(v)
  }
}
