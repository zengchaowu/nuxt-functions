import { writeFileSync, readFileSync, stat } from "fs";

export default (source, target) => {
  stat(target, function (err, stat) {
    if (stat && stat.isFile()) {
      console.log(`${target}已存在`);
    } else {
      let buffer = readFileSync(source);
      writeFileSync(target, buffer);
    }
  });
}