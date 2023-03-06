##Code Style Guidelines
###JS/TS Basics

####Asynchronous Code
JS provides us with different ways to manage asynchronous behaviour. We don't want to use callbacks anymore, 
since they add indents and cannot be used to loop over things. The best and cleanest solution to this is async/await.
Every method, that uses asynchronous functionalities must return a Promise. Every method, that calls Promise returning
methods must be async to use await in its function body. Keep in mind, that async functions return Promises by default,
so there is no need to specify that. A simple return statement is enough.
```
// The wrong way
function getThingsFromNetworkResource(lookForThis, callback){
    netWorkResource.findThing(lookForThis, function(foundThing){
        callback(foundThing);
    }
}

// The correct way
async function getThingsFromNetworkResource(lookForThis){
    return await netWorkResource.findThing(lookForThis);
}
```

####Type casting / assertions
In TS we can cast types in 2 different ways. One way is to use the <>-operator, the other one is the as-operator. 
The <>-operator is already used a lot in TS, so use the as-operator for all casting/assertion needs. It is only used
in import statements which makes it easy to identify. Both methods are just compiler concepts and as such cannot fail 
to execute.
```
// The wrong way
const square = <Square>rectangle;

// The correct way
const square = rectangle as Square;
```

####Template Literals / String interpolation
Strings can be concatenated with pluses. That way we can add variables to static strings. However, a better, more 
readable way is to use Template Literals. In addition to providing a better syntax, we don't have to use ' or " to 
mark strings. Sometimes you need them both in the same String (e.g. when dealing with HTML code). Template Literals
don't use them upfront, which makes it unnecessary to ever escape ' or ".
~~~
// (this code if fucked up by markdown conventions, read the textform of this file instead of the markdown output)
// The wrong way
const html = "<button onclick='doThings(\'" + value + "\');'>";

// The correct way
const html = `<button onclick="doThings('${value}');">`;
~~~

###Functional and Object-Oriented Programming

####Function length and the "one thing" rule
Generally speaking it is a good idea to limit a function to do one thing only. This definition is kind of vague.
One good way to think about it is function extraction. If you can still pull a function out of an existing function, 
that function did more than one thing.

####Function arguments
*Boolean Values*: Avoid using boolean values as function arguments. Most of the time they can be resolved before you
would even call a function. If you need a boolean to determine the outcome of a function, what you are really looking at 
(most of the time) is 2 functions. So extract another function instead of using a boolean value.<br>
As an argument, a boolean never explains itself in the function call. When reading the code you would have to jump to 
a different line to understand a boolean. That is obviously counterintuitive, so avoid it.<br>
Exceptions to this rule: Setting a switch OR Instantiating Objects in a specific state (sometimes you need booleans...)
<br>
*Too many arguments*: There is no specific number on how many arguments a function should have. However, most of the time 
there is a class rather than a function, if your function takes many arguments and sets some values. That is not 
"one thing" and it is certainly not really a function. So keep the amount of arguments down and think about a 
different approach, if you really feel the need to use many arguments.

####Abstractions
High level concepts don't go well with lower level code. A good example of this is UI Code and 
Database queries / HTTP-Requests / Log File creation. A well-structured function or object cares about one thing only, 
If that thing is UI code / User input processing or Application state changes they should never contain any database 
related code. They shouldn't even be in the same file to begin with.<br>
People tend to only see the high level code OR the low level code at once. Reading both is confusing for the next person.
This happens most of time, because you skip refactoring code, that you got working before. You are not 
done, when the code works. You are done after you structure and refactor the code properly.

####Pureness
A function is considered pure, when it has exactly one well-defined output with no side effects. Side effects can be 
a state change of the program like resetting a global variable etc. If a function does that, it should return void
rather than a value. A pure function sticks with the "one thing" rule and is easy to maintain and debug, because you
don't need to understand an entire class to fix a function.<br>
Never alter the state of a program within a function, that returns anything else then void.
~~~
// the wrong way
function addMoneyToBankAccount(accountAmount: number, addedAmount: number): number{
    const newAccountAmount = accountAmount + addedAmount;
    if(tooRich(newAccountAmount)) {
        sendMoneyToRobinHood(addedAmount); // probably changes a state here, a side effect
        newAccountAmount = accountAmount;
    }
    return newAccountAmount;
}

// the correct Way
function addTwoNumbers(num0: number, num1: number): number{
    return num0 + num1; // pure
}

function addMoneyToBankAccount(accountAmount: number, addedAmount: number): void{
    // state change
    if(tooRich(addTwoNumbers(accountAmount, addedAmount))) sendMoneyToRobinHood(addedAmount); 
}
~~~






