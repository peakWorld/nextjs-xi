import { useRef, useLayoutEffect } from "react";
import "./index.scss";

interface UseInnerScrollProps {
  ready?: boolean; // html结构是否已经准备完成(比如loading/failed等状态下, 获取到的元素高度不是最终结构的高度)
  visible?: boolean; // 弹窗是否可见
  enableInnerScroll?: boolean; // 内部元素是否可滚动
  innerScrollSelector?: string; // 弹窗内部滚动元素的选择器, 改元素必须设置固定高度
  onClose?: () => void; // 弹窗关闭
}

interface Cache {
  mask: HTMLDivElement | null;
  moveY: number;
}

/**
 * 禁止穿透滚动, 但是浮层内部可滚动(内容和遮幕分离, 只需要关注弹窗逻辑)
 */
export default function useInnerScroll(props: UseInnerScrollProps = {}) {
  const {
    visible = false,
    ready = true,
    innerScrollSelector,
    enableInnerScroll = true,
    onClose,
  } = props;
  const ref = useRef<HTMLDivElement>(null); // 必须指向弹窗的最外层元素
  const cache = useRef<Cache>({ mask: null, moveY: 0 });

  useLayoutEffect(() => {
    if (!ready) {
      return;
    }
    let maskDom = cache.current.mask;
    if (!maskDom) {
      maskDom = document.createElement("div");
      maskDom.className = "use-inner-scroll-mask";
      document.body.appendChild(maskDom);
      cache.current.mask = maskDom;
    }
    if (onClose) {
      maskDom.onclick = onClose;
    }
  }, [ready, visible, onClose]);

  // 弹窗的展示隐藏
  useLayoutEffect(() => {
    if (!ready) {
      return;
    }
    const wrapDom = ref.current as HTMLDivElement;
    const maskDom = cache.current.mask as HTMLDivElement;
    wrapDom.style.zIndex = "100";
    wrapDom.style.visibility = !visible ? "hidden" : "visible";
    maskDom.style.visibility = !visible ? "hidden" : "visible";
  }, [ready, visible]);

  // 可滑动元素
  useLayoutEffect(() => {
    if (!ready) {
      return;
    }
    const { mask } = cache.current;
    let handleTouchStart: (evt: TouchEvent) => void;
    let handleWrapScroll: (evt: TouchEvent) => void;
    let handleMaskScroll: (evt: TouchEvent) => void;
    let scrollDom = ref.current as HTMLDivElement;
    if (innerScrollSelector && enableInnerScroll) {
      scrollDom = scrollDom.querySelector(
        innerScrollSelector
      ) as HTMLDivElement;
    }
    if (scrollDom && mask) {
      if (enableInnerScroll) {
        scrollDom.style.overflowY = "auto";
      }
      const scrollHeight = scrollDom.scrollHeight;
      const clientHeight = scrollDom.clientHeight;

      handleTouchStart = (evt: TouchEvent) => {
        cache.current.moveY = evt.targetTouches[0].clientY;
      };

      handleWrapScroll = (evt: TouchEvent) => {
        evt.stopPropagation();
        if (!enableInnerScroll) {
          evt.preventDefault(); // 弹窗内部不能滚动
          return;
        }
        const _scrollDom = scrollDom;
        const { clientY } = evt.touches[0];
        const isUp = clientY < cache.current.moveY; // 是否为向上滑动

        // 两种情况下阻止滑动, 否则会带动body滚动
        if (scrollHeight - clientHeight <= _scrollDom.scrollTop && isUp) {
          // 滑动到底部
          evt.preventDefault();
        } else if (_scrollDom.scrollTop <= 0 && !isUp) {
          // 滑动到顶部
          evt.preventDefault();
        }
        cache.current.moveY = clientY;
      };

      // 遮幕滚动禁止
      handleMaskScroll = (evt: TouchEvent) => {
        evt.stopPropagation();
        if (evt.target === mask) {
          evt.preventDefault();
        }
      };

      /* 遮幕 */
      mask.addEventListener("touchmove", handleMaskScroll, { passive: false });
      /* 弹窗 */
      scrollDom.addEventListener("touchmove", handleWrapScroll, {
        passive: false,
      });
      scrollDom.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
    }
    innerScrollSelector &&
      console.log(`选择器${innerScrollSelector}元素不存在`);
    return () => {
      if (mask && scrollDom) {
        mask.removeEventListener("touchmove", handleMaskScroll);
        scrollDom.removeEventListener("touchmove", handleWrapScroll);
        scrollDom.removeEventListener("touchstart", handleTouchStart);
      }
    };
  }, [ready, innerScrollSelector, enableInnerScroll]);

  return [ref];
}
