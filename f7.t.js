import { setTimeout as delay } from 'timers/promises';
import buildF7 from './f7.js';

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  // buildF7(__dirname, _prj, cb);
  await buildF7('D:/js/wia/camp', 'camp');

  await delay(1000);
}
