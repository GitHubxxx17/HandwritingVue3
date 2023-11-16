// 通过rollup进行打包

//（1）引入相关依赖
import ts from "rollup-plugin-typescript2"; //解析ts
import json from "@rollup/plugin-json";
import resolvePlugin from "@rollup/plugin-node-resolve"; //解析第三方插件
import path from "path"; //处理路径
import { fileURLToPath } from "url";
import fs from "fs";

//处理__dirname在ES模块范围内未定义的问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//（2）获取文件路径
let packagesDir = path.resolve(__dirname, "packages");

// 2.1 获取需要打包的包
const name = process.env.TARGET;
let packageDir = path.resolve(packagesDir, name);
const resolve = (p) => path.resolve(packageDir, p);
//2.2 打包获取到每个包的项目配置
// 同步读取文件
let pkg = null;
let packageOptions = {};

try {
  pkg = JSON.parse(fs.readFileSync(`./packages/${name}/package.json`, "utf8"));
  packageOptions = pkg.buildOptions || {};
} catch (err) {
  console.error("获取到每个包的项目配置", err);
}
//3. 创建一个表
const outputOptions = {
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: "es",
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: "cjs",
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: "iife",
  },
};
//导出rollup配置
function createConfig(format, output) {
  //进行打包
  output.name = packageOptions.name;
  output.sourcemap = true;
  //生成rollup配置
  return {
    input: resolve("src/index.ts"), //导入
    output,
    plugins: [
      json(), //解析json
      ts({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      resolvePlugin(), //解析第三方插件
    ],
  };
}
console.log(
  packageOptions.formats.map((format) =>
    createConfig(format, outputOptions[format])
  )
);

export default packageOptions.formats.map((format) =>
  createConfig(format, outputOptions[format])
);
