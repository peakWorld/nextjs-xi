import { shallowReadonly } from "./core";

const Text = Symbol();
const Fragment = Symbol();

function renderVNode(vnode: any): any {
  const type = typeof vnode.type;
  if (type === "string") {
    return renderElementVNode(vnode);
  } else if (type === "object" || type === "function") {
    return renderComponentVNode(vnode);
  } else if (vnode.type === Text) {
    // 文本处理
  } else if (vnode.type === Fragment) {
    // 片段处理
  } else {
    // ...
  }
}

// --------------------- renderElementVNode -------------------

const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr".split(","); // void elements

function renderElementVNode(vnode: any) {
  const { type: tag, props, children } = vnode;
  // 判断是否为 void element
  const isVoidElement = VOID_TAGS.includes(tag);

  let ret = `<${tag}`;
  if (props) {
    ret += renderAttrs(props);
  }
  ret += isVoidElement ? "/>" : ">";

  // 自闭合标签，直接返回结果、无需处理children
  if (isVoidElement) return ret;

  if (typeof children === "string") {
    ret += children;
  } else if (Array.isArray(children)) {
    for (let child of children) {
      ret += renderVNode(child);
    }
  }
  ret += `</${tag}>`;
  return ret;
}

const shouldIgnoreProps = ["key", "ref"]; // 忽略的属性

const isBooleanAttr = (key: string) =>
  (
    `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly,` +
    `async,autofocus,autoplay,controls,default,defer,disabled,hidden,` +
    `loop,open,required,reversed,scoped,seamless,` +
    `checked,muted,multiple,selected`
  )
    .split(",")
    .includes(key); // boolean 属性

const isSSRSafeAttrName = (key: string) => !/[>/="'\u0009\u000a\u000c\u0020]/.test(key); // 合法且安全 属性

const escapeRE = /['"&<>]/; // 需转义字符

function renderAttrs(props: any) {
  let ret = "";
  // 根据key键进行过滤筛选
  for (const key in props) {
    if (shouldIgnoreProps.includes(key) || /^on[^a-z]/.test(key)) continue; // 忽略事件
    const value = props[key];
    ret += renderDynamicAttr(key, value);
  }
  return ret;
}

function renderDynamicAttr(key: any, value: any) {
  if (isBooleanAttr(key)) {
    return value === false ? `` : ` ${key}`;
  } else if (isSSRSafeAttrName(key)) {
    return value === "" ? ` ${key}` : ` ${key}="${escapeHtml(value)}"`;
  } else {
    console.warn(`[@vue/server-render] Skipped rendering unsafe attribute name: ${key}`);
  }
  return ``;
}

function escapeHtml(string: any) {
  const str = "" + string;
  const match = escapeRE.exec(str);
  if (!match) return str;

  let html = "";
  let escaped;
  let index; // 头指针, 走一遍字符串
  let lastIndex = 0; // 尾指针, 实体对应字符的下一位

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escaped = "&quot;";
        break;
      case 38: // &
        escaped = "&amp;";
        break;
      case 39: // '
        escaped = "&#39;";
        break;
      case 60: // <
        escaped = "&lt;";
        break;
      case 62: // >
        escaped = "&gt;";
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escaped;
  }
  return lastIndex === index ? html : html + str.substring(lastIndex, index);
}

// --------------------- renderComponentVNode -------------------

let currentInstance = null;
function setCurrentInstance(instance: any) {
  currentInstance = instance;
}

function resolveProps(options: any, propsData: any) {
  const props: any = {};
  const attrs: any = {};
  for (const key in propsData) {
    if (key in options || key.startsWith("on")) {
      props[key] = propsData[key];
    } else {
      attrs[key] = propsData[key];
    }
  }
  return [props, attrs];
}

export function renderComponentVNode(vnode: any) {
  const isFunction = typeof vnode.type === "function";
  let componentOptions = vnode.type;

  if (isFunction) {
    componentOptions = {
      render: vnode.type,
      props: vnode.type.props,
    };
  }

  let { render, data, setup, beforeCreate, created, props: propsOption } = componentOptions;

  beforeCreate && beforeCreate();

  const state = data ? data() : null;
  const [props, attrs] = resolveProps(propsOption, vnode.props);
  const slots = vnode.children || [];

  const instance = {
    state,
    props,
    isMounted: false,
    subTree: null,
    slots,
    mounted: [],
    keepAliveCtx: null,
  };

  function emit(event: any, ...payload: any) {
    const eventName = `on${event[0].toUpperCase() + event.slice(1)}`;
    const handler = instance.props[eventName];
    if (handler) {
      handler(...payload);
    } else {
      console.log("事件不存在");
    }
  }

  let setupState: any = null;
  if (setup) {
    const setupContext = { attrs, emit, slots };
    const prevInstance = setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), setupContext);
    setCurrentInstance(prevInstance);
    if (typeof setupResult === "function") {
      if (render) console.log("setup 函数返回渲染函数，render 选项将被忽略");
      render = setupResult;
    } else {
      setupState = setupResult;
    }
  }
  vnode.component = instance;

  const renderContext = new Proxy(instance, {
    get(t, k, r) {
      const { state, props, slots } = t;
      if (k === "$slots") return slots;

      if (state && k in state) {
        return state[k];
      } else if (k in props) {
        return props[k];
      } else if (setupState && k in setupState) {
        return setupState[k];
      } else {
        console.log("不存在");
      }
    },
    set(t, k, v, r) {
      const { state, props } = t;
      if (state && k in state) {
        state[k] = v;
      } else if (k in props) {
        props[k] = v;
      } else if (setupState && k in setupState) {
        setupState[k] = v;
      } else {
        console.log("不存在");
      }
      return true;
    },
  });

  created && created(renderContext);

  const subTree = render.call(renderContext, renderContext);
  return renderVNode(subTree);
}

// -------------------------test------------
(() => {
  const MyComponent = {
    setup() {
      return () => {
        return { type: "div", children: "Hello" };
      };
    },
  };

  // 描述组件的VNode对象
  const CompVNode = {
    type: MyComponent,
  };

  const ElementVNode = {
    type: "div",
    props: {
      id: "foo",
    },
    children: [{ type: "p", children: "hello" }, CompVNode],
  };

  // console.log("render result:\n");
  // console.log(renderVNode(ElementVNode));
})();
