declare let firstname: string;
declare let lastname: string;
declare let both: any;
declare let w: unknown;
declare let x: undefined;
declare let y: null;
declare const Fname: string[];
declare const names: readonly string[];
declare const numbers: number[];
declare let head: number;
declare let ourT: [number, boolean, string];
declare const readT: readonly [number, boolean, string];
declare const graph: [x: number, y: number];
declare const graphs: [number, number];
declare const z: number, b: number;
declare const car: {
    type: string;
    model: string;
    year: number;
};
declare const cars: {
    type: string;
    mileage?: number;
};
declare enum arrow {
    omni = 1,
    north = 2,
    east = 3,
    bi = 5,
    south = 6,
    west = 7
}
declare let direction: arrow;
declare enum statusCodes {
    NotFound = 404,
    Success = 200,
    Accepted = 202,
    Badrequest = 400
}
declare enum arrows {
    north = "north",
    east = "east",
    south = "south",
    west = "west"
}
declare type carY = number;
declare type carT = string;
declare type carM = string;
declare type car = {
    year: carY;
    type: carT;
    model: carM;
};
declare const carYear: carY;
declare const carType: carT;
declare const carModel: carM;
declare const Car: car;
interface Rectangle {
    height: number;
    width: number;
}
declare const rectangle: Rectangle;
interface Rect {
    height: number;
    width: number;
}
interface colorRect extends Rect {
    color: string;
}
declare const colorRect: colorRect;
declare function statusCode(code: string | number): void;
declare function getTime(): number;
declare function Hello(): void;
declare function multiply(a: number, b: number): number;
declare function add(a: number, b: number, c?: number): number;
declare function pow(value: number, exponent?: number): number;
declare function divide({ dividend, divisor }: {
    dividend: number;
    divisor: number;
}): number;
declare function add2(a: number, b: number, ...rest: number[]): number;
declare type Negate = (value: number) => number;
declare const negateFunc: Negate;
declare let a: unknown;
declare let c: unknown;
declare class Person {
    name: string;
}
declare const person: Person;
declare class Persons {
    private name;
    constructor(name: string);
    getName(): string;
}
declare const persons: Persons;
declare class Persona {
    private name;
    constructor(name: string);
    getName(): string;
}
declare const persona: Persona;
declare class Persone {
    private readonly name;
    constructor(name: string);
    getName(): string;
}
declare const persone: Persone;
interface Shape {
    getArea: () => number;
}
declare class rect_angle implements Shape {
    protected readonly width: number;
    protected readonly height: number;
    constructor(width: number, height: number);
    getArea(): number;
}
declare class Square extends rect_angle {
    constructor(width: number);
}
interface shape {
    getArea: () => number;
}
declare class rangleect implements shape {
    protected readonly width: number;
    protected readonly height: number;
    constructor(width: number, height: number);
    getArea(): number;
    toString(): string;
}
declare class square extends rangleect {
    constructor(width: number);
    toString(): string;
}
declare abstract class Polygon {
    abstract getArea(): number;
    toString(): string;
}
declare class anglerect extends Polygon {
    protected readonly width: number;
    protected readonly height: number;
    constructor(width: number, height: number);
    getArea(): number;
}
