import { patchAttr } from "./modules/attr";
import { patchClass } from "./modules/class";
import { patchEvent } from "./modules/event";
import { patchStyle } from "./modules/style";
export /**
 * 合并标签属性操作
 * @param {*} el 当前节点
 * @param {string} key 关键字
 * @param {*} prevValue 之前的值
 * @param {*} nextValue 当前的值
 */
const patchProp = (el: any, key: string, prevValue: any, nextValue: any) => {
  switch (key) {
    case "class":
      patchClass(el, nextValue); //处理类class
      break;
    case "style":
      patchStyle(el, prevValue, nextValue); //处理样式style
      break;
    default:
      if (/^on[^a-z]/.test(key)) {
        patchEvent(el, key, nextValue); //处理事件
      } else {
        patchAttr(el, key, nextValue); //处理属性
      }
      break;
  }
};
