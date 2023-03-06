<h1>Frontend refactoring</h1>

Andreas Lening <br>
27.04.2022 <br>

--------------------

<h3> After refactoring of component to changes from FE_refactore_by_SB.md doc file, you need to extend following files 
to get it working that at BE the new routes are called.</h3>

<br>
<h3>1) Extend modelNames at constants file with refactored components referral table name and the name of BE route </h3>

Path: client/src/app/_services/constants.service.ts

Structure of new line: 'referral table name': 'name of BE route'

```ts
/**
 * model names sorted by referral table names
 *
 * refTable: model name
 */
export const modelNames: {} = {
    ...
    'warehousing': 'warehousing'
}
```

<br>
<h3>2) Extend at main-table component the switch of getPKValue function, 
by adding new case for refactored component name and specify as return formValue with name of the table primary key </h3>

Path to file: client/src/app/dynamic-view/main-table/main-table.component.ts

Structure of new case: case('name of BE route') : return formValue['table primary key']

```ts
  /**
 * get primary key value for given referral table and form raw value
 *
 * @param refTable
 * @param formValue
 * @private
 */
private static getPKValue(refTable: string, formValue: {}) {
    switch (refTable) {
        ...
        case('warehousing') :
            return formValue['ID']
        ...
    }
}
```
