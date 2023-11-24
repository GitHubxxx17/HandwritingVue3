import { vnode } from "../types/global";
import { createVNode } from "./vNode";

export function apiCreateApp(render: Function) {
  return function createApp(rootComponent: any, rootProps: object) {
    let app = {
      //添加相关属性
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      mount(container: any) {
        //挂载位置
        //根据组件创建虚拟dom
        let vNode: vnode = createVNode(rootComponent, rootProps);
        render(vNode, container);
        app._container = container;
      },
    };
    return app;
  };
}
