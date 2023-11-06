export default class VerifyType {
  /**
   * @summary 判断数据的类型
   */
  private static checkType(data: unknown) {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
  }

  /**
   * @summary 检验数据类型是否为对象类型
   * @param {unknown} data
   */
  static isObject(data: unknown) {
    return ["object"].includes(this.checkType(data));
  }

  /**
   * @summary 检验数据是否为基本类型
   * @param {unknown} data
   */
  static isBasicType(data: unknown) {
    return [
      "null",
      "undefined",
      "string",
      "number",
      "boolean",
      "symbol",
    ].includes(this.checkType(data));
  }

  /**
   * @summary 检验数据是否为数字
   * @param {unknown} data
   */
  static isNumber(data: unknown) {
    return ["number"].includes(this.checkType(data));
  }

  /**
   * @summary 检验数据是否为函数类型
   * @param {unknown} data
   */
  static isFunc(data: unknown) {
    return ["function", "asyncfunction"].includes(this.checkType(data));
  }

  /**
   * @summary 检验数据是否为数组类型
   * @param {unknown} data
   */
  static isArray(data: unknown) {
    return ["array"].includes(this.checkType(data));
  }

  /**
   * @summary 检验数据是否为引用类型
   * @param {unknown} data
   */
  static isReference(data: unknown) {
    return this.isArray(data) || this.isObject(data) || this.isFunc(data);
  }

  /**
   * @summary 检验数据是否FormData类型, 主要用于类型上传
   * @param {unknown} data
   */
  static isFormData(data: unknown) {
    return data instanceof FormData;
  }
}
