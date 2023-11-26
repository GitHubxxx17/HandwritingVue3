export const enum LifecycleHooks {
  BEFORE_CREATE = "bc", // 组件生命周期钩子：在组件实例被创建之前触发
  CREATED = "c", // 组件生命周期钩子：在组件实例被创建之后触发

  BEFORE_MOUNT = "bm", // 组件生命周期钩子：在组件被挂载到 DOM 之前触发
  MOUNTED = "m", // 组件生命周期钩子：在组件被挂载到 DOM 之后触发
  BEFORE_UPDATE = "bu", // 组件生命周期钩子：在组件更新之前触发
  UPDATED = "u", // 组件生命周期钩子：在组件更新之后触发
  BEFORE_UNMOUNT = "bum", // 组件生命周期钩子：在组件被卸载之前触发
  UNMOUNTED = "um", // 组件生命周期钩子：在组件被卸载之后触发

  DEACTIVATED = "da", // 组件生命周期钩子：在组件被停用（deactivated）之后触发
  ACTIVATED = "a", // 组件生命周期钩子：在组件被激活（activated）之后触发
  RENDER_TRIGGERED = "rtg", // 组件生命周期钩子：在组件渲染触发之后触发
  RENDER_TRACKED = "rtc", // 组件生命周期钩子：在组件渲染追踪之后触发
  ERROR_CAPTURED = "ec", // 组件生命周期钩子：在捕获到错误之后触发
  SERVER_PREFETCH = "sp", // 组件生命周期钩子：在服务器预取（server prefetch）之后触发
}
