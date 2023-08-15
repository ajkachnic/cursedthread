# cursedthread

create worker threads in javascript with a Promise-like API!

```javascript
import { Thread } from "cursedthread";

// Spawned in a Worker Thread
const result = await Thread(name => {
  return `hello ${name}!`
}, "bob")
```

## api

```typescript
function Thread<Args extends Array, ReturnValue>(
  func: (...Args) => ReturnValue,
  ...args: Args
): Promise<ReturnValue>;
```

## how?

- _magic_
- call `func.toString()` and then parse with a javascript parser
- do some fun AST manipulations
- create a new worker with `{ eval: true }`
- wrap the worker in a promise

## caviots

- you can't reference values from outside the function context (*all necessary params must be passed in as arguments*)
