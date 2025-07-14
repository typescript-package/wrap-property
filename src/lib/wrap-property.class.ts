// Abstract.
import { WrapPropertyBase } from './wrap-property-base.abstract';
// Interface.
import { PropertyControllerShape } from '@typedly/controller';
import { WrappedPropertyDescriptor } from '@typedly/descriptor';
/**
 * @description The concrete class for wrapping object properties.
 * @export
 * @class WrapProperty
 * @template {object | (new () => any)} T The type of the target object or class to wrap the property of the given `key`.
 * @template {Record<PropertyKey, any>} [O=(T extends new () => T ? ( T extends { prototype: infer P } ? P : never) : T)] The object type of captured `T`.
 * @template {keyof O extends string | symbol ? keyof O : never} [K=keyof O extends string | symbol ? keyof O : never] The key type of the property to wrap.
 * @template {boolean} [A=boolean] The type of active property.
 * @template {boolean} [C=boolean] The type of configurable property.
 * @template {boolean} [E=boolean] The type of enumerable property.
 * @template {WrappedPropertyDescriptor<O, K, C, E>} [D=WrappedPropertyDescriptor<O, K, C, E>] The type of descriptor constrained by the `WrappedPropertyDescriptor`.
 * @template {PropertyControllerShape<O, K, A, C, E, D>} [Controller=PropertyControllerShape<O, K, A, C, E, D>] The type of controller that controls the wrapping behavior.
 * @extends {WrapPropertyBase<T, O, K, C, E, D>}
 */
export class WrapProperty<
  // Used to determine the type of the target object for picking the key from prototype.
  O extends Record<PropertyKey, any>,
  K extends keyof O extends string | symbol ? keyof O : never = keyof O extends string | symbol ? keyof O : never,
  A extends boolean = boolean,
  F extends boolean = boolean,
  C extends boolean = boolean,
  E extends boolean = boolean,
  D extends WrappedPropertyDescriptor<O, K, A, F, C, E> = WrappedPropertyDescriptor<O, K, A, F, C, E>,
  Controller extends PropertyControllerShape<O, K, A , F, C, E, D> = PropertyControllerShape<O, K, A, F, C, E, D>
> extends WrapPropertyBase<O, K, A, F, C, E, D> {
  /**
   * Creates an instance of `WrapProperty`.
   * @constructor
   * @param {O} object The target object or class to wrap the property of the given `key`.
   * @param {K} key The key of the property to wrap.
   * @param {?D} [descriptor] The descriptor of the property to wrap.
   * @param {?new (descriptor?: D) => Controller} [controller] The controller that controls the wrapping behavior.
   */
  constructor(
    object: O,
    key: K,
    descriptor?: D,
    controller?: new (descriptor?: D) => Controller
  ) {
    super(
      object,
      key,
      descriptor,
      controller
    );

    // Define the property with the given key and options.
    this.wrap(
      object,
      key
    );
  }

  public override activate(callback?: 'onGet' | 'onSet' | 'both'): this {
    super.activate(callback);
    return this;
  }

  public override deactivate(callback?: 'onGet' | 'onSet' | 'both'): this {
    super.deactivate(callback);
    return this;
  }

  public override disable(): this {
    super.disable();
    return this;
  }

  public override enable(): this {
    super.enable();
    return this;
  }

  public override unwrap(): this {
    super.unwrap();
    return this;
  }
}
