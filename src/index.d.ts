declare function Thread<Args extends Array, ReturnValue>(
  func: (...Args) => ReturnValue,
  ...args: Args
): Promise<ReturnValue>;

declare async function Thread<Args extends Array, ReturnValue>(
  func: (...Args) => Promise<ReturnValue>,
  ...args: Args
): Promise<ReturnValue>;
