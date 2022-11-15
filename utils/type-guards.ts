import { Pokemon } from '../_contracts';

/**
 * Type guard that validates that an object contains the specified property.
 */
export function hasOwnProperty<X extends Record<any, unknown>, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj[prop] !== undefined;
}
 
/**
 * Type guard that validates that an object contains all of the specified properties.
 */
export function hasOwnProperties<
  X extends Record<any, unknown>,
  Y extends PropertyKey,
  A extends Y[]
>(obj: X, props: A): obj is X & Record<Y, unknown> {
  return !props.map((prop) => obj[prop] !== undefined).includes(false);
}
 
/**
 * Type guard that validates that a value is an Object.
 */
export function isObject(val?: unknown): val is Record<string, unknown> {
  return val !== undefined && val !== null && typeof val === 'object';
}

/**
 * Type Guard to validate that the value is an Array.
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Type Guard to validate that the value is a number.
 */
export function isNumber(value: unknown): value is number {
  return !isNaN(Number(value));
}

/**
 * Type Guard to validate that the value is a string.
 */
export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === "[object String]";
}

// ----------- API Type Guards ------------

export function isPokemon(value: unknown): value is Pokemon {
  if (isObject(value)) {
    if (hasOwnProperties(value, ['id', 'name'])) {
      return isNumber(value.id) && isString(value.name);
    }
  }
  return false;
}

// type Pokemon = { id: number; name: string; image?: string };
/**
 * This is a type guard we will create to validate our Pokemon[] API response.
 */
export function isPokemonArray(value: unknown): value is Pokemon[] {
  if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {

    } 
  }
}
