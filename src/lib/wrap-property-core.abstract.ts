// Interface.
import { WrappedPropertyDescriptor } from '@typedly/descriptor';
/**
 * @description The core abstraction class for wrapping properties.
 * @export
 * @abstract
 * @class WrapPropertyCore
 * @template {Record<PropertyKey, any>} O The type of the object.
 * @template {keyof O} [K=keyof O] The key type of the property to wrap.
 * @template {boolean} [A=boolean] The type of active property.
 * @template {boolean} [F=boolean] The type of enabled property.
 * @template {boolean} [C=boolean] The type of configurable property.
 * @template {boolean} [E=boolean] The type of enumerable property.
 * @template {WrappedPropertyDescriptor<O, K, A, C, E>} [D=WrappedPropertyDescriptor<O, K, A, C, E>] The type of descriptor constrained by the `WrappedPropertyDescriptor`.
 * @template {object | undefined} [R=undefined] The type of controller that controls the wrapping behavior.
 */
export abstract class WrapPropertyCore<
  O extends Record<PropertyKey, any>,
  K extends keyof O = keyof O,
  A extends boolean = boolean,
  F extends boolean = boolean,
  C extends boolean = boolean,
  E extends boolean = boolean,
  D extends WrappedPropertyDescriptor<O, K, A, F, C, E> = WrappedPropertyDescriptor<O, K, A, F, C, E>,
  R extends object | undefined = undefined
> {
  /**
   * @description Defaults for active.
   * The active property indicates whether the callbacks `onGet` and `onSet` are active.
   * @public
   * @static
   * @type {boolean}
   */
  public static active: boolean = true;

  /**
   * @description Defaults for configurable.
   * @public
   * @static
   * @type {boolean}
   */
  public static configurable: boolean = true;

  /**
   * @description Defaults for enabled state of wrapped property.
   * If `true`, the property stores the value in the private key.
   * If `false`, the property does not store the value in the private key.
   * @public
   * @static
   * @type {boolean}
   */
  public static enabled: boolean = true;

  /**
   * @description Defaults for enumerable.
   * @public
   * @static
   * @type {boolean}
   */
  public static enumerable: boolean = false;

  /**
   * @description The controller that controls the wrapping behavior.
   * @public
   * @abstract
   * @readonly
   * @type {R}
   */
  public get controller(): R {
    return undefined as R;
  }

  /**
   * @description The descriptor that handles actual wrapped property.
   * @protected
   * @abstract
   * @readonly
   * @type {D}
   */
  protected abstract get descriptor(): D;

  /**
   * @description The key of the property to wrap.
   * @protected
   * @abstract
   * @readonly
   * @type {K}
   */
  protected abstract get key(): K;

  /**
   * @description The previous descriptor to unwrap last wrap.
   * @protected
   * @abstract
   * @readonly
   * @type {WrappedPropertyDescriptor<O, K, A, C, E> | PropertyDescriptor | undefined}
   */
  protected abstract get previousDescriptor(): WrappedPropertyDescriptor<O, K, A, C, E> | PropertyDescriptor | undefined;

  /**
   * @description The private key used to store the value of the property.
   * @protected
   * @abstract
   * @readonly
   * @type {PropertyKey}
   */
  protected abstract get privateKey(): PropertyKey;

  /**
   * @description The object of the property.
   * @protected
   * @abstract
   * @readonly
   * @type {O}
   */
  protected abstract get object(): O;
  
  /**
   * @description Unwraps the property using previous descriptor.
   * @public
   * @abstract
   * @returns {this} 
   */
  public abstract unwrap(): this;
  
  /**
   * @description Wraps the property with a private key using the specified key and descriptor.
   * @protected
   * @abstract
   * @param {O} object 
   * @param {K} key 
   * @returns {this} 
   */
  protected abstract wrap(object: O, key: K): this;
}
