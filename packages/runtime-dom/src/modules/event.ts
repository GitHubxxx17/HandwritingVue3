export const patchEvent = (el: any, key: string, value: any) => {
  //对函数进行缓存
  const invokers = el._vei || (el._vei = {});
  const exists = invokers[key];
  if (exists && value) {
    exists.value = value;
  } else {
    //获取事件名称
    const eventName = key.slice(2).toLowerCase();
    if (value) {
      let invoker = (invokers[eventName] = createInvoker(value));
      //添加事件
      el.addEventListener(eventName, invoker);
    } else {
      //删除事件
      el.removeEventLister(eventName, exists);
      invokers[eventName] = null; //清除缓存
    }
  }
};

/**
 * 创建缓存事件函数
 * @param {*} value 事件函数
 * @return {*} 缓存的事件函数
 */
function createInvoker(value: any) {
  const invoker = (e: any) => {
    invoker.value(e);
  };
  invoker.value = value;
  return invoker;
}
