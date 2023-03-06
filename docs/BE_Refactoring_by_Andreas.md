<h1>Backend refactoring</h1>

Andreas Lening <br>
27.04.2022 <br>

--------------------

<h3>For new components do follow next steps at BE:</h3>

<br>
<h3>1) Create new class model that extends from SoasModel at _routes/logic/models/_ folder </h3>

Example for new class named _NewClass_:
```ts
export class NewClass extends from SoasModel {
}
```

<br>

<h3>2) Extend ModelEnum and getModelByType with new class at _routes/logic/models/Helper.ts_</h3>

```ts
...
export enum ModelEnum {
    ...
    "NewClass"
}

export function getModelByType(type: ModelEnum): SequelizeModelStatic {
    switch (type) {
        ...
        case (ModelEnum.NewClass):
            return NewClass;
        ...            
...
```

<br>

<h3>3) Extend SequelizeModel with new class at _routes/logic/constants/constants.ts_</h3>

```ts
export type SequelizeModel =
    ...
    | NewClass;
```

<br>

<h3>4) Specify the type for new class at _routes/logic/models/NewClass.ts_ </h3>

```ts
export class NewClass extends from SoasModel {
    readonly type = ModelEnum.NewClass;
    ...
}
```

also implement 2 abstract functions of SoasModel:

```ts
export class NewClass extends from SoasModel {
    ...
    async fetchData(getParams: IGetParams):
    Promise<SequelizeModel[] | { table: [string, SequelizeModel[]]; maxRows: number; page: number }> {

        return await getData(this.type, getParams)
    }

    async saveData(postParams: IPostParams): Promise<SequelizeModel> {

        return await setData(this.type, postParams)
    }
    ...
}
```

<br>

<h3>5) Create new get and post routes (here named _newroute_) at _routes/models.ts_ </h3>

```ts
...

router.get('/newroute', function (req, res: any) {

    new NewClass().fetchData(getGETParams(req)).then(result => res.send(result));
});

router.post('/newroute', function (req, res: any) {

    new NewClass().saveData(getPOSTParams(req)).then(result => res.send(result));
});
...
```







