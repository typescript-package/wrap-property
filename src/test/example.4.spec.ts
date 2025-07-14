import { WrapProperty } from "../lib";

export class TestObject {
  firstName = 'First name';
  lastName = 'Last name';
  age = 1000;

  constructor(param11: number, param22: string) {}
}

const object = new TestObject(0, 'test');

let wrappedAgeFirst = new WrapProperty(object, 'age', { privateKey: '_age' });
let wrappedAgeSecond = new WrapProperty(object, 'age', { privateKey: '__age' });
let wrappedAgeThird = new WrapProperty(object, 'age', { privateKey: '___age' });

wrappedAgeSecond.unwrap(); // Unwraps the last, the field ___age is not connected. 

object.age = 3000;

console.debug(object.age); // 3000

console.debug(`---`);
