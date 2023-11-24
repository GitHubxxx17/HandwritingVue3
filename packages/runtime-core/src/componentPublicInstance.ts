import { hasOwn } from "@vue/shared";

export const componentPublicInstance = {
  get({ _: instance }: any, key: string) {
    const { props, setupState, data } = instance;

    //$ 开头的属性不可获取
    if (key[0] == "$") {
      return console.warn("can not get the value");
    }

    if (hasOwn(props, key)) {
      return props[key];
    } else if (hasOwn(setupState, key)) {
      return setupState[key];
    }
  },
  set({ _: instance }: any, key: string, value: any) {
    const { props, setupState, data } = instance;

    if (hasOwn(props, key)) {
      props[key] = value;
    } else if (hasOwn(setupState, key)) {
      setupState[key] = value;
    }
  },
};
