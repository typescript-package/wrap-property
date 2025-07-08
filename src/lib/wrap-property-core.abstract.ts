// Interface.
import { WrappedPropertyDescriptor } from '../interface';
/**
 * @description The core abstraction class for wrapping properties.
 * @export
 * @abstract
 * @class WrapPropertyCore
 * @template {object | (new () => any)} T The type of the target object or class to wrap the property of the given `key`.
 * @template {Record<PropertyKey, any>} [O=(T extends new () => T ? ( T extends { prototype: infer P } ? P : never) : T)] The object type of captured `T`.
 * @template {keyof O extends string | symbol ? keyof O : never} [K=keyof O extends string | symbol ? keyof O : never] The key type of the property to wrap.
 * @template {boolean} [C=boolean] The type of configurable property.
 * @template {boolean} [E=boolean] The type of enumerable property.
 * @template {WrappedPropertyDescriptor<O, K, C, E>} [D=WrappedPropertyDescriptor<O, K, C, E>] The type of descriptor constrained by the `WrappedPropertyDescriptor`.
 */
export abstract class WrapPropertyCore<
  T extends object | (new () => any),
  O extends Record<PropertyKey, any> = (T extends new () => T ? ( T extends { prototype: infer P } ? P : never) : T),
  K extends keyof O extends string | symbol ? keyof O : never = keyof O extends string | symbol ? keyof O : never,
  C extends boolean = boolean,
  E extends boolean = boolean,
  D extends WrappedPropertyDescriptor<O, K, C, E> = WrappedPropertyDescriptor<O, K, C, E>,
> {
  /**
   * @description Defaults for configurable.
   * @public
   * @static
   * @type {boolean}
   */
  public static configurable: boolean = true;

  /**
   * @description Defaults for enumerable.
   * @public
   * @static
   * @type {boolean}
   */
  public static enumerable: boolean = false;

  /**
   * @description The key of the property to wrap.
   * @protected
   * @abstract
   * @readonly
   * @type {K}
   */
  protected abstract get key(): K;

  /**
   * @description The private key used to store the value of the property.
   * @protected
   * @abstract
   * @readonly
   * @type {PropertyKey}
   */
  protected abstract get privateKey(): PropertyKey;

  /**
   * @description The target object of the property.
   * @protected
   * @abstract
   * @readonly
   * @type {T}
   */
  protected abstract get target(): T;
  
  /**
   * @description Unwraps the property using previous descriptor.
   * @public
   * @abstract
   * @returns {this} 
   */
  public abstract unwrap(): this;
  
  /**
   * @description Gets the previous descriptor of the property.
   * @protected
   * @abstract
   * @param {O} object 
   * @param {K} key 
   * @returns {(PropertyDescriptor | undefined)} 
   */
  protected abstract getPreviousDescriptor(object: O, key: K): PropertyDescriptor | undefined;
  
  /**
   * @description Wraps the property with a private key.
   * @protected
   * @abstract
   * @param {O} object 
   * @param {K} key 
   * @param {D} descriptor 
   * @returns {this} 
   */
  protected abstract wrap(object: O, key: K, descriptor: D): this;
}
