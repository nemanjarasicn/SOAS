# Angular

## Documentation

Last change: 02.11.2021
___

###Contents:

1. [Compile and run client/server](#anchortwo)
2. [Debug client](#anchorone)
3. [Create new files](#anchorthree)

     3.1 [Create new component](#anchorcomponent)

     3.2 [Create new service](#anchorservice)

4. [Build client](#anchorfour)
5. [Unit tests with Jasmine](#anchorfive)

---

### <a id="anchortwo" /> 1. Compile and run client/server

####Compile client angular code via Terminal manually at every code change:

```
\SOAS-GIT\client>ng build
```

Or by starting automatic compile function, that are watching for changes:

```
\SOAS-GIT\client>ng build --watch
```

See typescript.md documentation for compile and running Typescript on the server.


####Compile server Typescript via Terminal:

```
\SOAS-GIT>tsc -t es5 app.ts
```

Then run server via Webstorm configuration:

```
Run configuration via click on button "Run 'www'"
```

___

### <a id="anchorone" /> 2. Debug client

####Chrome browser - Debug directly

* Run application, open Chrome browser.
* At Chrome browser open DevTools:
```
Press Command + Option + J (Mac) or Control + Shift + J (Windows, Linux, Chrome OS) to jump straight into the Console panel.
```
* At DevTools switch to Sources tab.
* Open search menu by Control + P.
  Type into search text field the name of the component
  that you want to debug: e.g. price-list-sales.component.ts.
* In the search results list select the file, so it will be opened.
* In the opened file place the break point.
* Then refresh the view of debugged component. The execution process should stop at the break point.

####Webstorm - Create debug config

* From the main menu, choose Run | Edit Configuration, 
then in the Edit Configurations dialog, 
click the + button on the toolbar and select Javascript Debug from the list. 
* Add URL: http://localhost:3000/
* Activate "Ensure breakpoints are detected..." checkbox
* At "Before Lunch" section click the + button on the right and add "Run another configuration" as "Run Node.js 'www'".
* Save configuration
* Select new created configuration from the Select run/debug configuration list on the toolbar 
* Run it by clicking on the Debug button

```
\SOAS-GIT\client>ng s --port 3000
```

---

### <a id="anchorthree" /> 3. Create new files

####Create new component

```
ng generate component NewWindow --module=app
```

```
ng g component InfoDialog --module=app 
```

####Create component at sub folder
```
ng g component views/invoices --module=app
```
```
ng g component dialogs/confirmation-dialog --module=app
```

####Create new directive
```
ng g directive dynamic-field/dynamic-field --module=app
```

#### <a id="anchorservice" /> Create new service

#####Example of new service "hero" as src/app/hero.service.ts
```
ng generate service hero
```
```
ng g service views/orders
```

####Create new interface
```
ng g interface interfaces/production-parts-list-item
```

####Create new class
```
ng g class models/production-parts-list-item
```

---

###  <a id="anchorfour" /> 4. Build client

####(Default) Will output in dist/ and watch for changes, then rebuild.
```
ng build --watch 
```

####Take an option for passing a proxy for a backend (like express) that it will serve locally.
```
ng serve 
```

---

### <a id="anchorfive" /> 5. Unit tests with Jasmine

Got to the client unit-test documentation via following link: [unit-test-client]

---

[unit-test-client]: .\test\unit-test-client.md
