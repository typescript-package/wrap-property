import { WrapPropertyBase } from "../lib";

class CustomLogger extends WrapPropertyBase<typeof obj, 'someKey'> {
  constructor(object: typeof obj, key: 'someKey') {
    super(object, key, {
      onGet: (k, v) => {
        console.log(`Custom get for ${String(k)}: ${v}`);
        return v;
      }
    });
    super.wrap(object, key);
  }
}

const obj = { someKey: 123 };

new CustomLogger(obj, 'someKey');
obj.someKey; // Logs: Custom get for someKey: 123

console.debug(`---`);
