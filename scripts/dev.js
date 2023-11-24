import { execa } from "execa";

//对每个包进行打包
async function build(target) {
  // execa -c执行rollup配置，环境变量 -env
  await execa("rollup", ["-cw", "--environment", `TARGET:${target}`], {
    stdio: "inherit", //子进程输出到分包
  });
}

build("runtime-dom");
