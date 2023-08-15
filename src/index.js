import { Worker } from "node:worker_threads";

import { parse, print } from "recast";
import { builders as b, getFieldNames, getFieldValue, visit } from "ast-types";

function test() {
  onmessage = (args) => {
    (function abc(args) {})(args);
  };
}

function run(transformed, args) {
  const worker = new Worker(transformed, {
    eval: true,
    workerData: { args: args },
    type: "module",
  });

  return new Promise((resolve, reject) => {
    worker.on("online", () => {
      worker.postMessage(args);
    });
    worker.on("error", (error) => {
      reject(error);
    });

    worker.on("message", (value) => {
      resolve(value);
    });

    worker.on("exit", () => {
      resolve();
    });
  });
}

function removeReturns(ast) {
  return visit(ast, {
    visitReturnStatement(path) {
      const node = path.node;
      const replacement = b.expressionStatement(
        b.callExpression(
          b.memberExpression(
            b.identifier("parentPort"),
            b.identifier("postMessage")
          ),
          [node.argument]
        )
      );

      path.replace(replacement);

      this.traverse(path);
    },
  });
}

function transform(ast) {
  const functionBody = removeReturns(ast.program.body[0].expression);

  const transformed = b.program([
    b.variableDeclaration("const", [
      b.variableDeclarator(
        b.objectPattern([
          b.property(
            "init",
            b.identifier("workerData"),
            b.identifier("workerData")
          ),
          b.property(
            "init",
            b.identifier("parentPort"),
            b.identifier("parentPort")
          ),
        ]),
        b.callExpression(b.identifier("require"), [b.literal("worker_threads")])
      ),
    ]),
    b.expressionStatement(
      b.callExpression(functionBody, [
        b.spreadElement(
          b.memberExpression(b.identifier("workerData"), b.identifier("args"))
        ),
        // ),
      ])
    ),
  ]);

  return print(transformed).code;
}

/**
 *
 * @param {Function} func
 * @param {any[]} args
 */
export function Thread(func, ...args) {
  const ast = parse(func.toString());
  const transformed = transform(ast, args);

  // console.log(transformed);

  return run(transformed, args);
}
