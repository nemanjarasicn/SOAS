### <a id="anchorfive" /> Client unit tests with Jasmine

---

#### Start test

```
\SOAS-GIT\client>ng test
```

#### Test one file only - Skip all other test files

```
fdescribe()
```

#### Test one test function only

```
fit()
```

#### Skip test function

```
xit()
```

#### Check code coverage

Code coverage should be at least 85% for all 4 items: statements, branches, functions, lines,

#### Project coverage
```
\SOAS-GIT\client>ng test --no-watch --code-coverage
```

**Important:**

When the tests are complete, the command creates a new `/coverage` folder in the project or it overwrites its content if it existed before. Open the `index.html` file inside the **`/coverage`** folder to see a report with your source code and code coverage values.

#### Single file coverage
```
\SOAS-GIT\client>ng test --include=src/app/_services/form.service.spec.ts --no-watch --code-coverage
```

#### Print a list of all function names (for testing) of a class
```
console.log('All function names of FormService class: ', Object.getOwnPropertyNames( FormService.prototype ));
```

#### Test console.log function
```
// Arrange
console.log = jasmine.createSpy("log");

// Assert
expect(console.log).toHaveBeenCalledWith('Console log message.');
```

#### Test http error on getTableData function
```
// Arrange
const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
spyOn(tableDataService, 'getTableData').and.returnValue(throwError(errorResponse));
spyOn(tableDataService, 'handleHttpError').and.callThrough();

// Assert
expect(tableDataService.getTableData).toHaveBeenCalled();
expect(tableDataService.handleHttpError).toHaveBeenCalled();
```
#### Test function that returns a Promise
1. Wrap unit test function wrapped to be executed in the fakeAsync zone.
2.
```
  it('unit test name',  fakeAsync(() => {
   ...
   call of function returning a Promise
   ...
  }));
```

#### Error: 1 timer(s) still in the queue.

Solution: flush function usage.
```
it('test something', fakeAsync(() => {

  // ...

  flush();
}));
```
#### Set Jasmine default timout interval
```
beforeAll(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL= 10000;
});
```
#### Error: Timeout - Async function did not complete within 5000ms (set by jasmine.DEFAULT_TIMEOUT_INTERVAL)

Solution: use fakeAsync

```
it('should have a defined component', fakeAsync(() => {
    createComponent();
    expect(_AddComponent.ngOnInit).toBeDefined();
}));
```
