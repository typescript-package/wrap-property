import { WrapProperty } from "../lib";

class MyClass {
  myProp = 'hello';
}

const inst = new MyClass();

export const wrapped = new WrapProperty(inst, 'myProp', {
  active: true as boolean,
  enabled: true as boolean,
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

console.debug(`controller:`, wrapped.controller); // undefined, as no controller is set.
console.debug(`descriptor:`, wrapped.descriptor); // {active: true, configurable: true, enumerable: false, previousDescriptor: {…}, privateKey: '_myProp', …}

inst.myProp; // Logs: Accessed myProp hello → hello

wrapped.descriptor.enabled = false; // Disable the descriptor.

console.debug(inst.myProp); // undefined

wrapped.descriptor.enabled = true; // Enable the descriptor.
wrapped.descriptor.active = false; // Disable the active to not execute the `onGet` and `onSet` callbacks.

console.debug(inst.myProp); // hello

console.debug(`---`);