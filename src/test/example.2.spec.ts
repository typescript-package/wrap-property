import { WrapProperty } from "../lib";

export class Example {
  public static readonly staticValue = 42;
  public value = 1;
}

// Wrap the "value" property to log whenever it is accessed or set.
export const wrapped1 = new WrapProperty(
  Example.prototype,
  'value',
  {
    onGet(key, previousValue, value) {
      console.log(`Getting "${String(key)}":`, value);
      return value;
    },
    onSet(value, previousValue, key) {
      console.log(`Setting "${String(key)}":`, previousValue, '→', value);
      return value;
    },
  }
);

const example = new Example();

delete (example as any).value; // Remove the own property to ensure the wrap works.

example.value = 42; // Logs: Setting "value": 1 → 42
example.value; // Logs: Getting "value": 42

console.debug(`---`);
