//公共方法

export { ShapeFlags } from "./shapeFlag";

/**判断目标是否为对象
 * @export
 * @param {*} target 目标
 * @return {*}
 */
export function isObject(target: unknown): boolean {
  return target != null && typeof target === "object";
}

//合并对象
export const extend = Object.assign;

// 判断是否是数组
export const isArray = Array.isArray;

// 判断是否是函数
export const isFunction = (val: unknown) => typeof val === "function";

// 判断是否是字符串
export const isString = (val: unknown) => typeof val === "string";

// 判断是否是Symbol
export const isSymbol = (val: unknown) => typeof val === "symbol";

// 对象中是否有这个属性
const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key);

// 判断数组的key是不是整数
export const isIntegerKey = (key: string) => parseInt(key) + "" === key;

// 判断两个值是否相等
export const haseChange = (value: unknown, oldValue: unknown) =>
  value !== oldValue;
