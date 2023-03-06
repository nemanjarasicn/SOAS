import {TableTypes} from "../_services/constants.service";

export interface IFetchTableConfig {
  subtitle?: string
  refTable: string
  pk: string
  secondColumn?: string
  secondColumnValue?: string
  additionalSearch?: string
  onlyShowColumns?: string[]
  viewEditTabs?: IViewEditTab[]
  insertTogether?: IRelatedList[]
  relatedList?: IRelatedList
  modelOptions?: [] | { model: string; include?: { model: string; }; }[]
}

export interface IShowTogether {
  referenceColumn: string
  refTable: string
  subTubTitle: string
  tableType?: TableTypes
}

export interface IViewEditTab {
  pk: string 
  referenceColumn: string
  refTable: string
  tabTitle: string
  subtitle: string
  showTogether: IShowTogether[]
  viewEditTabs?: {}[]
  insertTogether?: IRelatedList[]
  relatedList?: IRelatedList
  options?: [] | { model: string; include?: { model: string; }; }[]
}

export interface IRelatedList {
  secondColumn?: string
  secondColumnValue?: string
  referenceColumn: string
  refTable: string
  subtitle: string
  pk?: string
  tableType?:  TableTypes
}
