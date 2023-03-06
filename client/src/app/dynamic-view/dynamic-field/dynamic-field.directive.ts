// import {
//   ComponentFactoryResolver,
//   Directive,
//   Input, OnInit,
//   ViewContainerRef
// } from "@angular/core";
// import { FormGroup } from "@angular/forms";
// import { InputComponent } from "../input/input.component";
// import { ButtonComponent } from "../button/button.component";
// import { SelectComponent } from "../select/select.component";
// //import { DateComponent } from "../date/date.component";
// //import { RadiobuttonComponent } from "../radiobutton/radiobutton.component";
// import {FieldConfig} from "../../interfaces/field.interface";
// import {CheckboxComponent} from "../checkbox/checkbox.component";
// import {TextareaComponent} from "../textarea/textarea.component";
// import {HiddenComponent} from "../hidden/hidden.component";
// import {EditableComponent} from "../editable/editable.component";
// import {SearchComponent} from "../search/search.component";
// import {AutocompleteComponent} from "../autocomplete/autocomplete.component";
// import {PautocompleteComponent} from "../pautocomplete/pautocomplete.component";
//
// const componentMapper = {
//   input: InputComponent,
//   button: ButtonComponent,
//   select: SelectComponent,
//   checkbox: CheckboxComponent,
//   textarea: TextareaComponent,
//   hidden: HiddenComponent,
//   editable: EditableComponent,
//   search: SearchComponent,
//   autocomplete: AutocompleteComponent,
//   pautocomplete: PautocompleteComponent
//   //date: DateComponent,
//   //radiobutton: RadiobuttonComponent,
//   //checkbox: CheckboxComponent
// };
// @Directive({
//   selector: '[dynamicField]'
// })
// export class DynamicFieldDirective implements OnInit {
//
//   @Input() field: FieldConfig;
//   @Input() group: FormGroup;
//   componentRef: any;
//   constructor(
//     private resolver: ComponentFactoryResolver,
//     private container: ViewContainerRef
//   ) {}
//   ngOnInit() {
//     const factory = this.resolver.resolveComponentFactory(
//       componentMapper[this.field.type]
//     );
//     this.componentRef = this.container.createComponent(factory);
//     this.componentRef.instance.field = this.field;
//     this.componentRef.instance.group = this.group;
//   }
//
// }
