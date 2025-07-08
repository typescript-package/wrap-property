// Abstract.
import { WrapPropertyCore } from './wrap-property-core.abstract';
// Interface.
import { WrappedPropertyDescriptor } from '../interface';
/**
 * @description The foundational class for wrapping properties.
 * @export
 * @abstract
 * @class WrapPropertyBase
 * @template {object | (new () => any)} T The type of the target object or class to wrap the property of the given `key`.
 * @template {Record<PropertyKey, any>} [O=(T extends new () => T ? ( T extends { prototype: infer P } ? P : never) : T)] The object type of captured `T`.
 * @template {keyof O extends string | symbol ? keyof O : never} [K=keyof O extends string | symbol ? keyof O : never] The key type of the property to wrap.
 * @template {boolean} [C=boolean] The type of configurable property.
 * @template {boolean} [E=boolean] The type of enumerable property.
 * @template {WrappedPropertyDescriptor<O, K, C, E>} [D=WrappedPropertyDescriptor<O, K, C, E>] The type of descriptor constrained by the `WrappedPropertyDescriptor`.
 * @extends {WrapPropertyCore<T, O, K, C, E, D>}
 */
export abstract class WrapPropertyBase<
  T extends object | (new () => any),
  O extends Record<PropertyKey, any> = (T extends new () => T ? (T extends { prototype: infer P } ? P : never) : T),
  K extends keyof O extends string | symbol ? keyof O : never = keyof O extends string | symbol ? keyof O : never,
  C extends boolean = boolean,
  E extends boolean = boolean,
  D extends WrappedPropertyDescriptor<O, K, C, E> = WrappedPropertyDescriptor<O, K, C, E>,
> extends WrapPropertyCore<T, O, K, C, E, D> {
  /**
   * @description The key of the property to wrap.
   * @protected
   * @readonly
   * @type {K}
   */
  protected get key() {
    return this.#key;
  }

  /**
   * @description The private key used to store the value of the property.
   * @protected
   * @readonly
   * @type {PropertyKey}
   */
  protected get privateKey() {
    return this.#privateKey;
  }

  /**
   * @description The target object of the property.
   * @protected
   * @readonly
   * @type {T}
   */
  protected get target() {
    return this.#target;
  }

  /**
   * @description Privately stored key of property.
   * @type {K}
   */
  #key: K;

  /**
   * @description Previous descriptor to unwrap
   * @type {?PropertyDescriptor}
   */
  #previousDescriptor?: PropertyDescriptor;

  /**
   * @description The private key under which the property value is stored.
   * @type {PropertyKey}
   */
  #privateKey: PropertyKey;

  /**
   * @description The target in which the property is wrapped.
   * @type {T}
   */
  #target: T;

  /**
   * Creates an instance of `WrapPropertyBase` child class.
   * @constructor
   * @param {T} target The target object or class to wrap the property of the given `key`.
   * @param {K} key The key to wrap the property.
   * @param {?D} [descriptor] The descriptor of the property to wrap.
   */
  constructor(
    target: T,
    key: K,
    descriptor?: D,
  ) {
    super();
    const object = (typeof target === 'function' ? target.prototype : target) as O;

    // Assign the key, target, and private key.
    this.#key = key;
    this.#target = target;
    this.#privateKey = descriptor?.privateKey || `_${String(key)}`; // Set the private key if not provided.

    // Define the private property to store the value.
    this.#hasPrivateProperty(object) === false && this.#definePrivateProperty(object, key);
  }

  /**
   * @description Gets the previous descriptor of the property that is used before wrapping property.
   * @protected
   * @param {O} object The object to get the previous descriptor from.
   * @param {K} key The key of the property to get the previous descriptor.
   * @returns {(PropertyDescriptor | undefined)} 
   */
  protected getPreviousDescriptor(object: O, key: K): PropertyDescriptor | undefined {
    this.#previousDescriptor = !this.#previousDescriptor
      ? Object.getOwnPropertyDescriptor(object, key) as PropertyDescriptor
      : this.#previousDescriptor as PropertyDescriptor;
    return this.#previousDescriptor;
  }

  /**
   * @description Unwraps the property using previous descriptor.
   * @public
   * @returns {this} 
   */
  public unwrap(): this {
    Object.defineProperty((typeof this.#target === 'function' ? this.#target.prototype : this.#target) as O, this.#key, this.#previousDescriptor!);
    delete (typeof this.target === 'function' ? this.target.prototype : this.#target)[this.#privateKey];
    return this;
  }
  
  /**
   * @description Wraps the property with a private indicator.
   * @protected
   * @param {O} object The object to wrap the property on.
   * @param {K} key The key of the property to wrap.
   * @param {WrappedPropertyDescriptor<O, K>} [param0={}] The options for wrapping the property.
   * @param {WrappedPropertyDescriptor<O, K>} param0.configurable Whether the property is configurable.
   * @param {WrappedPropertyDescriptor<O, K>} param0.enumerable Whether the property is enumerable.
   * @param {WrappedPropertyDescriptor<O, K>} param0.onGet The function to call when getting the property.
   * @param {WrappedPropertyDescriptor<O, K>} param0.onSet The function to call when setting the property.
   * @param {WrappedPropertyDescriptor<O, K>} param0.privateKey The private key to use for the property.
   * @returns {this}
   */
  protected wrap(
    object: O,
    key: K, {
      configurable,
      enumerable,
      onGet,
      onSet,
      privateKey,
    }: WrappedPropertyDescriptor<O, K> = {},
  ): this {
    // Get the previous descriptor of the property.
    const previousDescriptor = this.getPreviousDescriptor(object, key);

    // Define property with the given key and options.
    Object.defineProperty(
      object,
      key, {
        // Whether the property can be deleted or changed.
        configurable: configurable === undefined ? WrapPropertyCore.configurable : configurable,

        // Whether the property is visible in enumerations.
        enumerable: enumerable === undefined ? WrapPropertyCore.enumerable : enumerable,

        // Getter for the property.
        ...{
          get(): O[K] { 
            // Set the this as the target object.
            const t = (this as O);

            // Get the previous value from descriptor.
            const previousValue = previousDescriptor
              ? previousDescriptor.get && typeof previousDescriptor.get === 'function'
                ? previousDescriptor.get.call(this)
                : previousDescriptor.value
              : undefined;

            // Current descriptor.
            return onGet && typeof onGet === 'function'
              ? onGet.call(t, key, t[privateKey as keyof O] as O[K], previousValue, t) as O[K]
              : t[privateKey as keyof O] as O[K];
          }
        },

        // Setter for the property.
        ...{
          set(value: O[K]): void {
            // Set the this as the target object.
            const t = (this as O);

            // Get the previous value from previous descriptor or current value.
            const previousValue = (t[privateKey as keyof O] || (previousDescriptor as PropertyDescriptor)?.value) as O[K];

            // Perform previous descriptor.
            previousDescriptor?.set && previousDescriptor.set.call(t, value);

            // Set the private property value.
            t[privateKey as keyof O] = onSet && typeof onSet === 'function'
              ? onSet.call(t, value, previousValue, key, t) as O[K]
              : value;
          }
        },
      }
    );
    return this;
  }

  /**
   * @description Checks if the object has a private property.
   * @param {O} object The object to check for the private property.
   * @returns {boolean} 
   */
  #hasPrivateProperty(object: O): boolean {
    return Object.hasOwn(object, this.privateKey);
  }

  /**
   * @description Defines the private property in the object.
   * @param {O} object The object to define the private property on.
   * @param {K} key The key of the property to define.
   */
  #definePrivateProperty(object: O, key: K) {
    Object.defineProperty(
      object,
      this.privateKey, {
        configurable: true,
        enumerable: false,
        value: object[key],
        writable: true
      }
    );
  }
}
