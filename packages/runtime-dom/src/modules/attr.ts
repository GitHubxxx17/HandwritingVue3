export const patchAttr = (el: any, key: string, value: any) => {
  // if (value) {
  //   el.setAttribute(key, value);
  // } else {
  //   el.removeAttribute(key);
  // }
  value ? el.setAttribute(key, value) : el.removeAttribute(key);
};
