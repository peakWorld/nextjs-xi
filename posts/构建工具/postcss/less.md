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