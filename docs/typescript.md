### Install typescript by:

```
npm install -g typescript
```

### Compile typescript files with:

```
tsc app.ts
```

or 

By Error "Accessors are only available when targeting ECMAScript 5 and higher."

```
tsc -t es5 app.ts
```

Compile app.ts and all sql packages listed in tsc_files_to_compile.txt

```
tsc -t es5 app.ts @tsc_files_to_compile.txt
```


### Converting javascript to typescript:

#### I. Replace const with import at require(*):

```
Before: const sql = require('mssql'); 

After: import sql = require('mssql');
```
#### II. Functions params: added ": any"

```
Before: function (data)

After: function (data: any)
```

```
Before: function insertPRINTLISTSIntoDB (sqlqueries, callback) { ... }

After:  function insertPRINTLISTSIntoDB (sqlqueries: any, callback: any) { ... }
```

#### III. Added // @ts-ignore for logger, mssqlCall.mssqlCall

```
// @ts-ignore
logger.info(...);

// @ts-ignore
mssqlCall.mssqlCall
```

#### IV. Arrays

```
Before: let sqlQueries = [];

After: let sqlQueries: never[] | any[][] = [];	
```

### Copy object:

```
copy() {
this.editedItem = JSON.parse(JSON.stringify(this.item))
}
```



