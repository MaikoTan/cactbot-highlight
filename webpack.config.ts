import { Configuration } from "webpack";
import merge from "webpack-merge";

const common: Configuration = {};

const dev: Configuration = {};

const prod: Configuration = {};

export default [
  merge(common, dev),
  merge(common, prod),
];
