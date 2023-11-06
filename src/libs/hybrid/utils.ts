/*
 * @Author: lyf
 * @Date: 2021-10-21 19:02:59
 * @LastEditors: lyf
 * @LastEditTime: 2021-10-22 11:07:01
 * @Description: In User Settings Edit
 * @FilePath: /js-css-case/doc/hybrid/utils.ts
 */

/* 操作系统 ios || android */
export const os =
  navigator.userAgent.indexOf("Android") > -1 ? "android" : "ios";

export const checkType = (data: any) => {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
};
