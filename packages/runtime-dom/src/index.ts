import { extend } from "@vue/shared";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { createRender, h } from "@vue/runtime-core";

//合并dom操作和属性
const renderOptionDom = extend({ patchProp }, nodeOps);

//创建app组件实例
const createApp = (rootComponent: any, rootProps: any) => {
  //创建app实例
  let app = createRender(renderOptionDom).createApp(rootComponent, rootProps);
  const { mount } = app;
  app.mount = function (container: any) {
    //挂载组件
    //获取组件并清空内容
    container = nodeOps.querySelector(container);
    container.innerHTML = "";
    //将组件渲染的dom元素进行挂载
    mount(container);
  };
  return app;
};

export { createApp, h };
export * from "@vue/runtime-core";
