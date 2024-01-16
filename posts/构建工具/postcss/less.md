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
  variable: true;
  value: string;
}

interface AtRuleMixin extends AtRule {
  name: string;
  mixin: true;
  params: string;
}

// Node rule
interface Rule {
  type: 'rule';
  nodes: Array<Decl>;
  selector: string;
}

// Node decl
interface Decl {
  type: 'decl';
  prop: string;
  value: string;
}
```