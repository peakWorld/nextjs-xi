class DimensionGUIHelper {
  constructor(private obj: Record<string, any>, private minProp: string, private maxProp: string) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
  }
  get value() {
    return this.obj[this.maxProp] * 2;
  }
  set value(v) {
    this.obj[this.maxProp] = v / 2;
    this.obj[this.minProp] = v / -2;
  }
}

export default DimensionGUIHelper;
