export interface Validator {
  name: string;
  validator: any;
  message: string;
}
export interface FieldConfig {
  id?: string;
  label?: string;
  name?: string;
  inputType?: string;
  options?: object[];
  collections?: any;
  type: string;
  //required: boolean;
  //disabled?: boolean;
  readonly?: boolean;
  value?: any;
  validations?: Validator[];
}
