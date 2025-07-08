// Interface.
import { AccessorPropertyDescriptor } from '@typedly/descriptor';
import { GetterCallback, SetterCallback } from '@typedly/callback';
/**
 * @description The interface for wrapped property descriptor.
 * @export
 * @interface WrappedPropertyDescriptor
 * @template O 
 * @template {keyof O} K The key type constrained by the object `O`.
 * @template {boolean} [A=boolean] The type of active property, which can be a boolean or an object with `onGet` and `onSet` properties.
 * @template {boolean} [C=boolean] The type of configurable property.
 * @template {boolean} [E=boolean] The type of enumerable property.
 * @extends {AccessorPropertyDescriptor<O[K], C, E>}
 */
export interface WrappedPropertyDescriptor<
  O,
  K extends keyof O,
  A extends boolean = boolean,
  C extends boolean = boolean,
  E extends boolean = boolean,
> extends AccessorPropertyDescriptor<O[K], C, E> {
  /**
   * @description Whether the property descriptor `onGet` and `onSet` callbacks are active.
    * @type {?(A | {onGet?: boolean; onSet?: boolean})}
   */
  active?: A | {onGet?: boolean; onSet?: boolean};

  /**
   * @description The key used to access the property in the object.
   * @type {?PropertyKey}
   */
  privateKey?: PropertyKey;

  /**
   * @description The callback function that is called when the property is accessed.
   * @type {?GetterCallback<O, K>}
   */
  onGet?: GetterCallback<O, K>;

  /**
   * @description The callback function that is called when the property is set.
   * @type {?SetterCallback<O, K>}
   */
  onSet?: SetterCallback<O, K>;
}
