// Abstract.
import { WrapPropertyCore } from './wrap-property-core.abstract';
// Interface.
import { PropertyControllerShape } from '@typedly/controller';
import { WrappedPropertyDescriptor } from '@typedly/descriptor';
/**
 * @description The foundational class for wrapping properties.
 * @export
 * @abstract
 * @class WrapPropertyBase
 * @template {Record<PropertyKey, any>} O The type of the object.
 * @template {keyof O} [K=keyof O] The key type of the property to wrap.
 * @template {boolean} [A=boolean] The type of active property.
 * @template {boolean} [F=boolean] The type of enabled property.
 * @template {boolean} [C=boolean] The type of configurable property.
 * @template {boolean} [E=boolean] The type of enumerable property.
 * @template {WrappedPropertyDescriptor<O, K, C, E>} [D=WrappedPropertyDescriptor<O, K, C, E>] The type of descriptor constrained by the `WrappedPropertyDescriptor`.
 * @template {PropertyControllerShape<O, K, A, C, E, D>} [R=PropertyControllerShape<O, K, A, C, E, D>] The type of controller that controls the wrapping behavior.
 * @extends {WrapPropertyCore<T, O, K, C, E, D, R>}
 */
export abstract class WrapPropertyBase<
  O extends Record<PropertyKey, any>,
  K extends keyof O = keyof O,
  A extends boolean = boolean,
  F extends boolean = boolean,
  C extends boolean = boolean,
  E extends boolean = boolean,
  D extends WrappedPropertyDescriptor<O, K, A, F, C, E> = WrappedPropertyDescriptor<O, K, A, F, C, E>,
  R extends PropertyControllerShape<O, K, A, F, C, E, D> = PropertyControllerShape<O, K, A, F, C, E, D>
> extends WrapPropertyCore<O, K, A, F, C, E, D, R> {
  /**
   * @inheritdoc
   * @public
   * @readonly
   * @type {R}
   */
  public override get controller() {
    return this.#controller as R;
  }

  /**
   * @description The descriptor that handles actual wrapped property.
   * @public
   * @readonly
   * @type {D}
   */
  public get descriptor(): D {
    return this.controller
      ? this.controller.descriptor
      : this.#descriptor as D;
  }

  /**
   * @description The key of the property to wrap.
   * @protected
   * @readonly
   * @type {K}
   */
  protected get key(): K {
    return this.#key;
  }

  /**
   * @description The previous descriptor of the wrapped property.
   * @protected
   * @readonly
   * @type {*}
   */
  protected get previousDescriptor(): WrappedPropertyDescriptor<O, K, A, C, E> | PropertyDescriptor | undefined {
    return this.controller
      ? this.controller.descriptor.previousDescriptor
      : this.descriptor.previousDescriptor;
  }

  /**
   * @description The private key used to store the value of the property.
   * @protected
   * @readonly
   * @type {PropertyKey}
   */
  protected get privateKey(): PropertyKey {
    return (this.controller
      ? this.controller.descriptor.privateKey
      : this.descriptor.privateKey) as PropertyKey;
  }

  /**
   * @description The target object of the property.
   * @protected
   * @readonly
   * @type {T}
   */
  protected get object(): O {
    return this.#object;
  }

  /**
   * @description Privately stored controller that controls the wrapping behavior.
   * @type {?R}
   */
  #controller?: R;

  /**
   * @description
   * @type {D}
   */
  #descriptor?: D;

  /**
   * @description Privately stored key of property.
   * @type {K}
   */
  #key: K;

  /**
   * @description The target in which the property is wrapped.
   * @type {O}
   */
  #object: O;

  /**
   * Creates an instance of `WrapPropertyBase` child class.
   * @constructor
   * @param {O} object The target object or class to wrap the property of the given `key`.
   * @param {K} key The key to wrap the property.
   * @param {?D} [descriptor] The descriptor of the property to wrap.
   * @param {?new (descriptor?: D) => R} [controller] The controller that controls the wrapping behavior.
   */
  constructor(
    object: O,
    key: K,
    descriptor?: D,
    controller?: new (descriptor?: D) => R
  ) {
    super();

    // If the descriptor is not provided, create a default one.
    descriptor = {
      ...{
        active: WrapPropertyCore.active,
        configurable: WrapPropertyCore.configurable,
        enumerable: WrapPropertyCore.enumerable,
        previousDescriptor: Object.getOwnPropertyDescriptor(object, key) as PropertyDescriptor,
        privateKey: `_${String(key)}`
      },
      ...descriptor,
    } as D;

    // If the controller is provided, create an instance of it.
    controller
      ? this.#controller = new controller(descriptor)
      : this.#descriptor = descriptor;

    // The key to wrap.
    this.#key = key;
  
    // The target object to wrap the property on.
    this.#object = object;

    // Define the private property to store the value.
    this.#hasPrivateProperty(object) === false && this.#definePrivateProperty(object, key);
  }

  /**
   * @description Unwraps the property using previous descriptor.
   * @public
   * @returns {this} 
   */
  public unwrap(): this {
    const previousDescriptor = ((this.#controller ? this.#controller.descriptor : this.#descriptor) as D).previousDescriptor;
    previousDescriptor &&
      (
        Object.defineProperty(this.object, this.key, previousDescriptor),
        this.privateKey && delete this.object[this.privateKey]
      );
    return this;
  }

  /**
   * @description Wraps the property with a private indicator.
   * @protected
   * @param {O} object The object to wrap the property on.
   * @param {K} key The key of the property to wrap.
   * @returns {this}
   */
  protected wrap(
    object: O,
    key: K
  ): this {
    // Wrap acts as controller.
    const controller = this.#controller ? this.#controller : this;

    // The getter for the property.
    const get = controller.descriptor.get
      ? controller.descriptor.get
      : function(this: O): O[K] {
        if (controller.descriptor.enabled === false) {
          return undefined as O[K];
        }

        // Set the this as the target object.
        const o = (this as O);

        // Get the previous value from descriptor.
        const previousValue = controller.descriptor.previousDescriptor
          ? controller.descriptor.previousDescriptor.get && typeof controller.descriptor.previousDescriptor.get === 'function'
            ? controller.descriptor.previousDescriptor.get.call(this)
            : (controller.descriptor.previousDescriptor as PropertyDescriptor).value
          : undefined;


        // Current descriptor.
        return controller.descriptor.onGet
          && ((typeof controller.descriptor.active === 'boolean' && controller.descriptor.active)
            || (typeof controller.descriptor.active === 'object' && controller.descriptor.active.onGet === true))
          ? controller.descriptor.onGet.call(o, key, previousValue, o[controller.descriptor.privateKey as K] as O[K], o) as O[K]
          : o[controller.descriptor.privateKey as K] as O[K];
      };

    // The setter for the property.
    const set = controller.descriptor.set
      ? controller.descriptor.set
      : function(this: O, value: O[K]): void {
        if (controller.descriptor.enabled === false) {
          return undefined as O[K];
        }

        // Set the this as the target object.
        const o = (this as O);

        // Get the previous value from previous descriptor or current value.
        const previousValue = (controller.descriptor.privateKey as keyof O || (controller.descriptor.previousDescriptor as PropertyDescriptor)?.value) as O[K];

        // Perform previous descriptor.
        controller.descriptor.previousDescriptor?.set && controller.descriptor.previousDescriptor.set.call(o, value);

        // Set the private property value.
        Object.assign(
          o,
          {
            [controller.descriptor.privateKey as K]: controller.descriptor.onSet
              && (
                (typeof controller.descriptor.active === 'boolean' && controller.descriptor.active)
                || (typeof controller.descriptor.active === 'object' && controller.descriptor.active.onSet === true)
              )
              ? controller.descriptor.onSet.call(o, value, previousValue, key, o) as O[K]
              : value
          }
        );
      };

    // Define property with the given key and options.
    Object.defineProperty(
      object,
      key, {
        configurable: controller.descriptor.configurable, // Whether the property can be deleted or changed.
        enumerable: controller.descriptor.enumerable, // Whether the property is visible in enumerations.
        get, // Getter for the property.
        set, // Setter for the property.
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
