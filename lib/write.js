import ts from "typescript";
import isNil from "lodash.isnil";
import { readFileSync, writeFileSync } from "fs";

const getExport = (source) => {
  for (let statement of source.statements) {
    if (ts.isExportAssignment(statement)) {
      return statement;
    }
  }
  return null;
};

const getNode = (statement, keypath) => {
  const keys = keypath.split(".");
  let node;

  let properties;

  if (statement.properties) {
    properties = statement.properties;
  }

  if (statement.expression) {
    properties = statement.expression.properties;
  }

  if (properties) {
    for (let propertie of properties) {
      if (propertie.name.escapedText === keys[0]) {
        node = propertie.initializer;
        break;
      }
    }
  }
  if (isNil(node)) {
    return null;
  } else {
    if (keys.length === 1) {
      return node;
    }
    return getNode(node, keys.splice(1, 1).join("."));
  }
};

export default (
  source = "nuxt.config.js",
  filename = "nuxt.config.js",
  keypath = "head.title",
  value = "i like code"
) => {
  let tsSourceFile = ts.createSourceFile(
    filename,
    readFileSync(source, "utf8"),
    ts.ScriptTarget.Latest
  );

  const _export = getExport(tsSourceFile);
  const node = getNode(_export, keypath);
  node.text = value;
  writeFileSync(filename, ts.createPrinter().printFile(tsSourceFile), "utf8");
};
