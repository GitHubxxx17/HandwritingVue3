import { readdirSync, statSync } from "fs";
import { execa } from "execa";
//将不是文件夹的文件过滤
const dirs = readdirSync("packages").filter((p) => {
  return statSync(`packages/${p}`).isDirectory();
});

//对每个包进行打包
async function build(target) {
  // execa -c执行rollup配置，环境变量 -env
  await execa("rollup", ["-c", "--environment", `TARGET:${target}`], {
    stdio: "inherit", //子进程输出到分包
  });
}

//并行打包
function runParaller(dirs, itemfn) {
  let result = [];
  for (let item of dirs) {
    result.push(itemfn(item));
  }
  return Promise.all(result);
}

runParaller(dirs, build).then(() => {
  console.log("成功");
});

console.log(dirs);
