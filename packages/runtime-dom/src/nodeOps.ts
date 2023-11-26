export const nodeOps = {
  //创建元素
  createElement: (tagName: string) => document.createElement(tagName),
  //移除元素
  remove: (child: any) => {
    let parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  //插入元素
  insert: (child: any, parent: any, anchor = null) => {
    parent.insertBefore(child, anchor);
  },
  //查询元素
  querySelector: (select: any) => document.querySelector(select),
  //设置元素文本
  setElementText: (el: any, text: string) => (el.textContent = text),
  //创建文本节点
  createText: (text: string) => document.createTextNode(text),
  //设置文本节点文本
  setText: (node: any, text: string) => (node.nodeValue = text),
};
