# 执行命令
```ts
// watch-ts 监听ts文件, 有文件修改则重新编译
// watch-less 监听ts编译后的文件, ts每次重新编译 重新执行一次 命令‘less’
// watch-style 监听less|scss文件, 有文件修改则执行一次 命令‘less’
// less 执行编译后的文件
```

# Node
```ts
// Node comment
interface Comment {
  type: 'comment';
  inline: boolean;
  text: string
}

// Node atrule
interface AtRule {
  type: 'atrule';
  params: string;
}

interface AtRuleImport extends AtRule {
  name: 'import',
  import: true;
  filename: string;
}

interface AtRuleVar extends AtRule {
  name: string;
  value: string;
  variable: true;
}

interface AtRuleMixin extends AtRule {
  name: string;
  params: string;
  mixin: true;
  important?: boolean;
}

// Node rule
interface Rule {
  type: 'rule';
  nodes: Array<Decl>;
  selector: string;
  extend?: boolean
}

// Node decl
interface Decl {
  type: 'decl';
  prop: string;
  value: string;
  extend?: boolean
}
```