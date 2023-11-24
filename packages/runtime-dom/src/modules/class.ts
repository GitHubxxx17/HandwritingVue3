export const patchClass = (el: any, value: string | null) => {
  //处理
  // if (!value) {
  //   value = "";
  // }
  // //对这个标签的class赋值
  // el.className = value;
  el.className = value || "";
};
