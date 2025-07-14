import { GetterCallback, SetterCallback } from '@typedly/callback';
import { WrapProperty } from '../lib';
import { PropertyControllerShape } from '@typedly/controller';
import { PropertyDescriptorChainShape, WrappedPropertyDescriptor } from '@typedly/descriptor';

export class TestObject {
  firstName = 'First name';
  lastName = 'Last name';
  age = 1000;

  constructor(param11: number, param22: string) {}
}

export class TestController<
  O extends Record<PropertyKey, any>,
  K extends keyof O = keyof O,
  A extends boolean = boolean,
  F extends boolean = boolean,
  C extends boolean = boolean,
  E extends boolean = boolean,
  D extends WrappedPropertyDescriptor<O, K, A, F, C, E> = WrappedPropertyDescriptor<O, K, A, F, C, E>
> implements PropertyControllerShape<O, K, A, F, C, E, D> {
  #chain?: PropertyDescriptorChainShape<O, K, any, A, C, E>;
  #descriptor: D;
  #descriptors?: Set<PropertyDescriptor>;
  #key: K;
  #object: O;
  #previousDescriptor?: PropertyDescriptor;

  constructor(descriptor: D, object: O, key: K) {
    this.#descriptor = descriptor;
    this.#object = object;
    this.#key = key;
    this.#previousDescriptor = Object.getOwnPropertyDescriptor(object, key) as PropertyDescriptor;
  }
  get active(): A | undefined {
    return this.#descriptor.active as A | undefined;
  }
  get descriptor(): D {
    return this.#descriptor as D;
  }
  get descriptorChain(): PropertyDescriptorChainShape<O, K, any, A, C, E> | undefined {
    return this.#chain
  }
  get descriptors(): Set<PropertyDescriptor> | undefined {
    return this.#descriptors
  }
  get key(): K {
    return this.#key;
  }
  get object(): O {
    return this.#object;
  }
  get previousDescriptor(): PropertyDescriptor {
    return this.#descriptor.previousDescriptor as any;
  }
  get privateKey() {
    return this.#descriptor.privateKey as PropertyKey;
  }
  get: D['get'] | undefined;
  set: D['set'] | undefined;
  get onGet(): GetterCallback<O, K> | undefined {
    return this.#descriptor.onGet;
  }
  get onSet(): SetterCallback<O, K> | undefined {
    return this.#descriptor.onSet;
  }
  attach(): this {
    return this;
  }
  addDescriptor(descriptor: PropertyDescriptor): this {
    this.#descriptors?.add(descriptor);
    return this;
  }
  getDescriptor(id: number): PropertyDescriptor {
    return this.#descriptors?.values().next().value as PropertyDescriptor; // Simplified for example purposes.
  }
  removeDescriptor(id: number): this {
    this.#descriptors?.delete(this.getDescriptor(id));
    return this;
  }
  isActive(): boolean {
    return this.#descriptor!.active === true;
  }
  setActive(active: boolean): this {
    this.#descriptor!.active = active as any;
    return this;
  }
}

export class WrappedTestObject extends WrapProperty<TestObject> {
  constructor(
    object: TestObject = new TestObject(1000, 'Test'),
    key: keyof TestObject = 'firstName'
  ) {
    super(object, key);
  }
}