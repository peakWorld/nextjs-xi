class StringToNumberHelper {
  constructor(private obj: Record<string, any>, private prop: string) {
    this.obj = obj;
    this.prop = prop;
  }
  get value(): number {
    return this.obj[this.prop];
  }
  set value(v: string) {
    this.obj[this.prop] = parseFloat(v);
  }
}
export default StringToNumberHelper;
