import { haseChange, isArray } from "@vue/shared";
import { Track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./oprations";

export function ref(rawValue: any) {
  return createRef(rawValue);
}

export function shallowRef(target: any) {
  return createRef(target, true);
}

//ref实现类
class RefImpl {
  public __v_isRef = true;
  public _value;
  constructor(public rawValue: any, public shallow: boolean) {
    this._value = rawValue; //用户传入的数据
    this.rawValue = rawValue; //用户传入的数据
  }

  //类的属性访问器
  get value() {
    Track(this, TrackOpTypes.GET, "value");
    return this._value;
  }

  set value(newValue) {
    if (haseChange(newValue, this._value)) {
      this._value = newValue;
      this.rawValue = newValue;
      trigger(this, TriggerOpTypes.SET, "value", newValue);
    }
  }
}

//创建ref对象
function createRef(rawValue: any, shallow = false) {
  return new RefImpl(rawValue, shallow);
}

export function toRef(target: any, key: string) {
  return new ObjectRefImpl(target, key);
}

class ObjectRefImpl {
  public __v_isRef = true;
  constructor(public target: any, public key: string) {}

  get value() {
    return this.target[this.key];
  }

  set value(newValue) {
    this.target[this.key] = newValue;
  }
}

// 实现toRefs
export function toRefs(target: any) {
  // 遍历
  let ret: any = isArray(target) ? new Array(target.length) : {};
  for (let key in target) {
    ret[key] = toRef(target, key);
  }
  return ret;
}
