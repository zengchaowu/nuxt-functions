import mkdirp from "mkdirp";

export default (target) => {
  mkdirp.sync(target);
  return target
}