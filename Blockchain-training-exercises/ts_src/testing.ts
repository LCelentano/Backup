
//TYPESTRING
console.log("HELLO");

//boolean
//number
//string

//Typescript assigns a type: explicit and implicit

//Explicit: writing out the type
let firstname: string = "Bobby"; //firstname = 12 will throw an error since the types aren't the same

//implicit: TS will guess the type based on assigned value
let lastname = "Dylan";

//TS may not always properly infer what the type of a variable may be. In this case it will assign the type "any" which
//will disable type checking

let both: any = "number";
both = 22;

//This behavior can be disabled by enabling noImplicitAny as an option in a TypeScript's project tsconfig.json.
//That is a JSON config file for customizing how some of TypeScript behaves.

//the "unknown" type is a safer alternative to "any"

let w: unknown = 1;
w = "string"
w = { runANonExistentMethod: () => {console.log("something");}} as { runANonExistentMethod: () => void }

if (typeof w == 'object' && w !== null) {
    (w as { runANonExistentMethod: Function }).runANonExistentMethod();
}

//"never" type throws an error whenever defined
//let x: never = true;

//type undefined & null
let x: undefined = undefined;
let y: null = null;

//Arrays
const Fname: string[] = [];
Fname.push("Dylan");

//the type "readonly" prevents arrays from being changed
const names: readonly string[] = ["Dylan"];
//names.push("Jack");

//TS can infer the type of an array if it has values
const numbers = [1,2,3];
numbers.push(4);
//numbers.push("2");
let head: number = numbers[0];

//Tuples: typed array with a pre-defined length and types for each index
let ourT: [number, boolean, string];
ourT = [5, false, "killroy was here"];
//ourT = [false, "ooga booga", 5];

//readonly tuple
const readT: readonly [number, boolean, string] = [5, true, "killroy"];

//named tuples
const graph: [x: number, y: number] = [55.2, 41.3];

//destructuring tuples
const graphs: [number, number] = [55.2, 41.3];
const [z, b] = graphs;

//TS object types
const car: {type: string, model: string, year: number } = {
    type: "Toyota",
    model: "Corolla",
    year: 2009
};

car.type = "Ford";
//car.type = 2;

//optional properties
const cars : { type: string, mileage?: number} = {
    type: "Toyota"
};
cars.mileage = 2000;

//Numeric Enums
//by default enums will start at 0 and add 1 to each value
enum arrow {
    omni = 1,
    north,
    east,
    bi = 5,
    south,
    west

}
let direction = arrow.north;
//direction = 2
//assigning a number changes the initial point

enum statusCodes {
    NotFound = 404,
    Success = 200,
    Accepted = 202,
    Badrequest = 400
}

//string enum
enum arrows {
    north = "north",
    east = "east",
    south = "south",
    west = "west"
}
console.log(arrows.north);

//Aliases
type carY = number
type carT = string
type carM = string
type car = {
    year: carY,
    type: carT,
    model: carM
}

const carYear: carY = 2001;
const carType: carT = "Toyota";
const carModel: carM = "Corolla";
const Car: car = {
    year: carYear,
    type: carType,
    model: carModel
};

//interfaces: similar to type Aliases, except the only apply to object types
interface Rectangle {
    height: number,
    width: number
}

const rectangle: Rectangle = {
  height: 20,
  width: 10
};

//extending interfaces

interface Rect {
    height: number,
    width: number
}

interface colorRect extends Rect {
    color: string
}

const colorRect: colorRect = {
    height: 20,
    width: 10,
    color: "red"
}

//Union
//or = |
function statusCode(code: string | number) {
    console.log(`status code is ${code}.`)
}
statusCode(404);
statusCode("404");

//return type
function getTime(): number {
    return new Date().getTime();
}

//void return type
function Hello(): void {
    console.log("Hello");
}
//function doesn't return any value

function multiply(a: number, b: number) {
    return a * b;
}

function add(a: number, b: number, c?: number) {
    return a + b + (c || 0);
}

//default parameters
function pow(value: number, exponent: number = 10) {
    return value ** exponent;
}

//named parameters
function divide({dividend, divisor}: { dividend: number, divisor: number}) {
    return dividend/divisor;
}

//rest parameters
function add2(a: number, b: number, ...rest: number[]) {
    return a + b + rest.reduce((p,c) => p + c, 0);
}

//type alias
type Negate = (value: number) => number;
const negateFunc: Negate = (value) => value * -1;
console.log(negateFunc(10));
//passes 10 into the function

//casting with as
let a: unknown = 'hello';
console.log((x as string).length);
//casting doesn't change the type of the data within the variable
//let x: unknown = 4;
//console.log((x as string).length); throws error since numbers don't have length
//console.log((4 as string).length); also throughs error

//casting with <>
let c: unknown =  'hello';
console.log((<string>a).length);
//<> works the same as "as"

//force casting: overrides type errors that TS may throw when casting
// let d =  'hello';
// console.log(((x as unknown)as number).length);
// x is not actually a number so this will return undefined

//Classes
//members (properties and methods)
class Person {
    name: string;
}

const person =  new Person
person.name = "Jane";

//members: visibility
//public: default, allows access to the class from anywhere
//private: only allows access to the class member from within the class
//protected: allows access to the class from itself, and any classes that inherit it

class Persons {
    private name: string;

    public constructor(name: string) {
        this.name = name;
    }
    public getName(): string {
        return this.name;
    }
}

const persons = new Persons("Jane");
console.log(persons.getName());
//this isn't accessible from outside the class because its private

//parameter properties
//a convenient way to define class members in the constructor, by adding a visibility modifiers to the parameter
class Persona {
    public constructor(private name: string) {}

    public getName(): string {
        return this.name;
    }
}

const persona = new Persona("Jane");
console.log(persona.getName());

//readonly
//prevents class members from being changed
class Persone {
    private readonly name: string

    public constructor(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }
}

const persone = new Persone("Jane");
console.log(persone.getName());

//inheritance: implements
interface Shape {
    getArea: () => number;
}

class rect_angle implements Shape {
    public constructor(protected readonly width: number, protected readonly height: number) {}
    public getArea(): number {
        return this.width * this.height;
    }
}

//inheritance: extends
class Square extends rect_angle {
    public constructor(width: number) {
        super(width, width);
    }
}

//override: When a class extends another class, it can replace the members of the parent class with the same name.
interface shape {
    getArea: () => number;
}

class rangleect implements shape {
    public constructor(protected readonly width: number, protected readonly height: number) {}

    public getArea(): number {
        return this.width * this.height;
    }

    public toString(): string {
        return `rangleect[width=${this.width}, height=${this.height}]`;
    }
}

class square extends rangleect {
    public constructor(width: number) {
        super(width, width);
    }

    public override toString(): string {
        return `square[width=${this.width}]`
    }
}

//abstract classes: Classes can be written in a way that allows them to be used as a base class for other classes without having to implement all the members.
abstract class Polygon {
    public abstract getArea(): number;

    public toString(): string {
        return `Polygon[area=${this.getArea()}]`;
    }
}

class anglerect extends Polygon {
    public constructor(protected readonly width: number, protected readonly height: number) {
        super();
    }

    public getArea(): number {
        return this.width * this.height;
    }
}

//Basic generics: allow creating 'type variables' which can be used to create classes, functions & type aliases that don't need to explicitly define the types that they use

