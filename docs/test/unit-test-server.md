### Server unit tests

---

#### Folder of server tests is: 

```

C:\Repos\Soas\test

``` 

#### Set up a test script in package.json:

```

 "scripts": {
    ...
    
    "test": "mocha 'test/**/*.js' --recursive",
    "test-coverage": "nyc npm run test",
    
    ...
  }

```

#### Open terminal and run tests:

```

C:\Repos\Soas\> npm test

```

#### Run tests with coverage

```

C:\Repos\Soas> npm run test-coverage

```
