#Backend Refactoring
Ronny Brandt - 08.04.2022
##What to do?
We want to switch from using plain mssql to sequelize, an ORM implementation for typescript.
Additionally, we want to create separate endpoints for all models. The idea is, that all models are handled separately, 
so we can change one without breaking the endpoint for all other models. 
##How to do it
Sequelize alongside its type specs is already installed. By using the Sequelize init function we are required 
to compile our ts code to ECMAScript 6, since sequelize is using the class features from it.
<br/><br/>
To add a new Model:<br/><br/> 
1.) Create a new ts file in **/router/logic/models** named after the model, you want to create 
(see *Currency.ts* for reference).<br/>
2.) Make sure to type the attributes by using the **declare** keyword.<br/>
3.) Call the Model.init function to define the Database model<br/>
4.) Add the required get and post endpoints to **/routes/models**.
##Best Practices for using Sequelize in SOAS
###Pagination
We are using it and will continue to use it. Since all counting is the same for all models, we can write a single 
function for it. Additionally, Sequelize gives us a handy tool in "findAndCountAll" to show off how many 
positions we have in total. 
###Endpoints
We need at least:<br/>
**One** *GET* endpoint for fetching the table data. It can be configured to use a filter (if provided) 
or fetch the entire thing if not. Usually there will be filter params, since we are using pagination.
<br/>
**One** *GET* endpoint to search for a specific entry for the detail view. Sequelize has an awesome function in 
"findByPk" which returns a single Object by primary key. 
<br/>
**One** *POST* endpoint to save data. Sequelize will do whatever the database does with insert or update queries.
To create a new entry, just skip adding the primary key or provide a new value for a unique field, whatever applies to 
the table. For updating a model it is safest to first create an instance of it (by finding it) and then call the update 
function directly on the model (see sequelize_test.zip from our skype group).
