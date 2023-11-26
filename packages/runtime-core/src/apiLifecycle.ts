import { LifecycleHooks } from "./enums";
import { currentInstance, setCurrentInstance } from "./components";
import { instance } from "../types/global";

export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT);
export const onMounted = createHook(LifecycleHooks.MOUNTED);
export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE);
export const onUpdated = createHook(LifecycleHooks.UPDATED);
export const onBeforeUnmount = createHook(LifecycleHooks.BEFORE_UNMOUNT);
export const onUnmounted = createHook(LifecycleHooks.UNMOUNTED);

/**
 * 创建生命周期
 * @param {LifecycleHooks} lifecycle
 */
function createHook(lifecycle: LifecycleHooks) {
  return function (hook: Function, target = currentInstance) {
    injectHook(lifecycle, hook, target);
  };
}

/**
 * 注入依赖函数
 * @param {LifecycleHooks} lifecycle
 * @param {Function} hook
 * @param {instance | null} target
 */
function injectHook(
  lifecycle: LifecycleHooks,
  hook: Function,
  target: instance | null
) {
  if (!target) return;
  const hooks = target[lifecycle] || (target[lifecycle] = []);

  //切片
  const rap = () => {
    setCurrentInstance(target);
    hook(); //执行生命周期前存放实例
    setCurrentInstance(null);
  };

  hooks.push(rap);
}

export /**
 * 遍历执行函数
 * @param {Function[]} hooks
 */
const invokeArrayFns = (hooks: Function[]) => {
  hooks.forEach((fn) => fn && fn());
};
