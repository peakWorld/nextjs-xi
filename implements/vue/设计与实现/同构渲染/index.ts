import { renderComponentVNode } from "./toHtml";
import { ref } from "./core";
import { renderer } from "./render";

const MyComponent = {
  name: "App",
  setup() {
    const str = ref("foo");

    return () => {
      return {
        type: "div",
        children: [
          {
            type: "span",
            children: str.value,
            props: {
              onClick() {
                str.value = "bar";
              },
            },
          },
          { type: "span", children: "baz" },
        ],
      };
    };
  },
};

const CompVNode = { type: MyComponent };

const html = renderComponentVNode(CompVNode); // 由服务端渲染的字符串

const container = document.createElement("div"); // 挂载点
container.innerHTML = html;

renderer.hydrate(CompVNode, container); // 客户端激活
