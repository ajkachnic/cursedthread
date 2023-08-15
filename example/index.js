import { Thread } from "../src/index.js";

const threads = [];

for (let i = 0; i < 10; i++) {
  const thread = Thread((i) => {
    console.log(`Thread ${i} started`);
    return i * 2;
  }, i);
  threads.push(thread);
}

const results = await Promise.all(threads);
console.log(results);
