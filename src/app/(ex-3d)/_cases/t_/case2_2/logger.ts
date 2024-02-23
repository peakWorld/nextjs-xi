class ClearingLogger {
  private lines: any[];

  constructor(private elem: HTMLElement) {
    this.elem = elem;
    this.lines = [];
  }
  log(...args: any[]) {
    this.lines.push([...args].join(" "));
  }
  render() {
    this.elem.textContent = this.lines.join("\n");
    this.lines = [];
  }
}

export default ClearingLogger;
