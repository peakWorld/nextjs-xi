export enum PseudoElt {
  BEFORE = ":before",
  AFTER = ":after",
}

/**
 * 下载文件
 */
export function download(blob: Blob, filename: string) {
  const a = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * 获取元素的实时样式
 * @param {HTMLElement} elt dom元素
 * @param {keyof CSSStyleDeclaration} key 指定的样式
 * @param {PseudoElt} pseudoElt 伪元素
 */
export function getCurrentStyle({
  elt,
  key,
  pseudoElt,
}: {
  elt: HTMLElement;
  key: keyof CSSStyleDeclaration;
  pseudoElt?: PseudoElt;
}) {
  let cssKey = "";
  let cssKeys = (key as string).match(/[A-Z]?[a-z]+/g);
  if (cssKeys) {
    const tmpCssKeys = cssKeys.map((item) => item.toLowerCase());
    cssKey = tmpCssKeys.join("-");
  }
  return window.getComputedStyle(elt, pseudoElt).getPropertyValue(cssKey);
}
