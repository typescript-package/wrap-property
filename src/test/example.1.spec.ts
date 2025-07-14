import { WrapProperty } from "../lib";

class MyClass {
  myProp = 'hello';
}

const inst = new MyClass();

new WrapProperty(inst, 'myProp', {
  onGet(key, previousValue, value) {
    console.log(
      `Accessed ${String(key)}`,
      previousValue,
      '→',
      value
    );
    return value;
  }
});

inst.myProp; // Logs: Accessed myProp hello → hello

console.debug(`---`);