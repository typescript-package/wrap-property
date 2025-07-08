// Abstract.
import { WrapPropertyBase } from './wrap-property-base.abstract';
// Interface.
import { WrappedPropertyDescriptor } from '../interface';
/**
 * @description The concrete class for wrapping object properties.
 * @export
 * @class WrapProperty
 * @template {object | (new () => any)} T The type of the target object or class to wrap the property of the given `key`.
 * @template {Record<PropertyKey, any>} [O=(T extends new () => T ? ( T extends { prototype: infer P } ? P : never) : T)] The object type of captured `T`.
 * @template {keyof O extends string | symbol ? keyof O : never} [K=keyof O extends string | symbol ? keyof O : never] The key type of the property to wrap.
 * @template {boolean} [C=boolean] The type of configurable property.
 * @template {boolean} [E=boolean] The type of enumerable property.
 * @template {WrappedPropertyDescriptor<O, K, C, E>} [D=WrappedPropertyDescriptor<O, K, C, E>] The type of descriptor constrained by the `WrappedPropertyDescriptor`.
 * @extends {WrapPropertyBase<T, O, K, C, E, D>}
 */
export class WrapProperty<
  // Used to determine the type of the target object for picking the key from prototype.
  T extends object | (new () => any),
  O extends Record<PropertyKey, any> = (T extends new () => T ? ( T extends { prototype: infer P } ? P : never) : T),
  K extends keyof O extends string | symbol ? keyof O : never = keyof O extends string | symbol ? keyof O : never,
  C extends boolean = boolean,
  E extends boolean = boolean,
  D extends WrappedPropertyDescriptor<O, K, C, E> = WrappedPropertyDescriptor<O, K, C, E>,
> extends WrapPropertyBase<T, O, K, C, E, D> {
  /**
   * Creates an instance of `WrapProperty`.
   * @constructor
   * @param {T} target The target object or class to wrap the property of the given `key`.
   * @param {K} key The key of the property to wrap.
   * @param {?D} [descriptor] The descriptor of the property to wrap.
   */
  constructor(
    target: T,
    key: K,
    descriptor?: D
  ) {
    super(
      target,
      key,
      descriptor
    );

    // Define the property with the given key and options.
    this.wrap(
      (typeof target === 'function' ? target.prototype : target) as O,
      key,
      descriptor
    );
  }
}
