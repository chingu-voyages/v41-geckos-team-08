# handyHub

## Coding standards

### Semicolons

There should not be any semicolons (This is my personal preference, but we can change this if the mayority of the team prefers semicolons)

### Variable and Constants

All variables should be in camel case, and have a name that is descriptive. eg:

``` JavaScript
thisIsAVariableName
```

All constants should be in upper case and in a snake format. eg:

``` JavaScript
THIS_IS_A_CONSTANT_NAME
```

All variables should be declare as const unless it requires to be a let.  eg:

```JavaScript
const thisIsAVariable
```

### Functions

All functions should be declared with a descriptive name as an arrow function and some comments explaining what are the parameters and the return values.  This will help us with the code assistant: eg:

```JavaScript

/** 
 * Brief description
 * 
 * @param {<type>} param1
 * @param {<type>} param2
 * 
 * @returns 
*/
const functionName = (param1, param2) => {
    // Do something
    return // returns something
}

```

## Floder Structure

The project will be in the same repo and will have at its root 2 follders, a Client and a Server.

In the Client folder, there will be all of the frontend files and in the Server folder there will be all of the backend files.

In each of the base folders, there must be an .env file where we will set all of the required environment variables for each side to work

### Server folder

Each of the API's endpoints should be in a sepparate file inside the routes folder

```JavaScript
/Server
   .env //environment file
   index.js // main file with the express server
   evironment.js // file that reads the .env file and exports all of the values
   /src // all of the files required
      /routes // all of the routes files
      /config // database configuration files
      /auth //authentication files
```
