//TYPESTRING
console.log("HELLO");
//boolean
//number
//string
//Typescript assigns a type: explicit and implicit
//Explicit: writing out the type
let firstname = "Bobby"; //firstname = 12 will throw an error since the types aren't the same
//implicit: TS will guess the type based on assigned value
let lastname = "Dylan";
//TS may not always properly infer what the type of a variable may be. In this case it will assign the type "any" which
//will disable type checking
let both = "number";
both = 22;
//This behavior can be disabled by enabling noImplicitAny as an option in a TypeScript's project tsconfig.json.
//That is a JSON config file for customizing how some of TypeScript behaves.
//the "unknown" type is a safer alternative to "any"
let w = 1;
w = "string";
w = { runANonExistentMethod: () => { console.log("something"); } };
if (typeof w == 'object' && w !== null) {
    w.runANonExistentMethod();
}
//"never" type throws an error whenever defined
//let x: never = true;
//type undefined & null
let x = undefined;
let y = null;
//Arrays
const Fname = [];
Fname.push("Dylan");
//the type "readonly" prevents arrays from being changed
const names = ["Dylan"];
//names.push("Jack");
//TS can infer the type of an array if it has values
const numbers = [1, 2, 3];
numbers.push(4);
//numbers.push("2");
let head = numbers[0];
//Tuples: typed array with a pre-defined length and types for each index
let ourT;
ourT = [5, false, "killroy was here"];
//ourT = [false, "ooga booga", 5];
//readonly tuple
const readT = [5, true, "killroy"];
//named tuples
const graph = [55.2, 41.3];
//destructuring tuples
const graphs = [55.2, 41.3];
const [z, b] = graphs;
//TS object types
const car = {
    type: "Toyota",
    model: "Corolla",
    year: 2009
};
car.type = "Ford";
//car.type = 2;
//optional properties
const cars = {
    type: "Toyota"
};
cars.mileage = 2000;
//Numeric Enums
//by default enums will start at 0 and add 1 to each value
var arrow;
(function (arrow) {
    arrow[arrow["omni"] = 1] = "omni";
    arrow[arrow["north"] = 2] = "north";
    arrow[arrow["east"] = 3] = "east";
    arrow[arrow["bi"] = 5] = "bi";
    arrow[arrow["south"] = 6] = "south";
    arrow[arrow["west"] = 7] = "west";
})(arrow || (arrow = {}));
let direction = arrow.north;
//direction = 2
//assigning a number changes the initial point
var statusCodes;
(function (statusCodes) {
    statusCodes[statusCodes["NotFound"] = 404] = "NotFound";
    statusCodes[statusCodes["Success"] = 200] = "Success";
    statusCodes[statusCodes["Accepted"] = 202] = "Accepted";
    statusCodes[statusCodes["Badrequest"] = 400] = "Badrequest";
})(statusCodes || (statusCodes = {}));
//string enum
var arrows;
(function (arrows) {
    arrows["north"] = "north";
    arrows["east"] = "east";
    arrows["south"] = "south";
    arrows["west"] = "west";
})(arrows || (arrows = {}));
console.log(arrows.north);
const carYear = 2001;
const carType = "Toyota";
const carModel = "Corolla";
const Car = {
    year: carYear,
    type: carType,
    model: carModel
};
const rectangle = {
    height: 20,
    width: 10
};
const colorRect = {
    height: 20,
    width: 10,
    color: "red"
};
//Union
//or = |
function statusCode(code) {
    console.log(`status code is ${code}.`);
}
statusCode(404);
statusCode("404");
//return type
function getTime() {
    return new Date().getTime();
}
//void return type
function Hello() {
    console.log("Hello");
}
//function doesn't return any value
function multiply(a, b) {
    return a * b;
}
function add(a, b, c) {
    return a + b + (c || 0);
}
//default parameters
function pow(value, exponent = 10) {
    return value ** exponent;
}
//named parameters
function divide({ dividend, divisor }) {
    return dividend / divisor;
}
//rest parameters
function add2(a, b, ...rest) {
    return a + b + rest.reduce((p, c) => p + c, 0);
}
const negateFunc = (value) => value * -1;
console.log(negateFunc(10));
//passes 10 into the function
//casting with as
let a = 'hello';
console.log(x.length);
//casting doesn't change the type of the data within the variable
//let x: unknown = 4;
//console.log((x as string).length); throws error since numbers don't have length
//console.log((4 as string).length); also throughs error
//casting with <>
let c = 'hello';
console.log(a.length);
//<> works the same as "as"
//force casting: overrides type errors that TS may throw when casting
// let d =  'hello';
// console.log(((x as unknown)as number).length);
// x is not actually a number so this will return undefined
//Classes
//members (properties and methods)
class Person {
}
const person = new Person;
person.name = "Jane";
//members: visibility
//public: default, allows access to the class from anywhere
//private: only allows access to the class member from within the class
//protected: allows access to the class from itself, and any classes that inherit it
class Persons {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
const persons = new Persons("Jane");
console.log(persons.getName());
//this isn't accessible from outside the class because its private
//parameter properties
//a convenient way to define class members in the constructor, by adding a visibility modifiers to the parameter
class Persona {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
const persona = new Persona("Jane");
console.log(persona.getName());
//readonly
//prevents class members from being changed
class Persone {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
const persone = new Persone("Jane");
console.log(persone.getName());
class rect_angle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
}
//inheritance: extends
class Square extends rect_angle {
    constructor(width) {
        super(width, width);
    }
}
class rangleect {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
    toString() {
        return `rangleect[width=${this.width}, height=${this.height}]`;
    }
}
class square extends rangleect {
    constructor(width) {
        super(width, width);
    }
    toString() {
        return `square[width=${this.width}]`;
    }
}
//abstract classes: Classes can be written in a way that allows them to be used as a base class for other classes without having to implement all the members.
class Polygon {
    toString() {
        return `Polygon[area=${this.getArea()}]`;
    }
}
class anglerect extends Polygon {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
}
//Basic generics: allow creating 'type variables' which can be used to create classes, functions & type aliases that don't need to explicitly define the types that they use
//# sourceMappingURL=testing.js.map