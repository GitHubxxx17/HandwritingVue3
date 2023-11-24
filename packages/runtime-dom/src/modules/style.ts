export const patchStyle = (el: any, prev: any, next: any) => {
  const style = el.style;
  if (!next) {
    //移除所有属性
    el.removeAttribute("style");
  } else {
    if (prev) {
      for (let key in prev) {
        if (next[key]) {
          //清空
          style[key] = "";
        }
      }
    }

    for (let key in next) {
      style[key] = next[key];
    }
  }
};
