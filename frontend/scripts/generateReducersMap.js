/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const modules = require("../modules.json");

function getSlices(reduxDir) {
  let slices = [];
  if (fs.existsSync(reduxDir)) {
    const reducerData = require(reduxDir);
    if (reducerData.length) {
      slices = reducerData;
    }
  }
  return slices;
}

function getModulesWithSlices() {
  const outputJsonFile = path.resolve(__dirname, "../reducersMap.tsx");
  const moduleSlices = [];
  modules.forEach((item) => {
    const MODULES_DIR = path.resolve(__dirname, `../modules/${item.name}`);
    const reduxDir = path.join(MODULES_DIR, "redux/reducer.json");
    const slices = getSlices(reduxDir);
    moduleSlices.push({
      moduleName: item.name,
      slices: slices,
    });
  });

  const APP_DIR = path.resolve(__dirname, `../`);
  const appReduxDir = path.join(APP_DIR, "redux/reducer.json");
  const appSlices = getSlices(appReduxDir);
  if (appSlices && appSlices.length > 0) {
    moduleSlices.push({
      moduleName: "main",
      slices: appSlices,
    });
  }

  let reducerMapString = "export const reducers = {\n";
  let reducerImportString = "";

  moduleSlices.forEach((moduleObj) => {
    const { moduleName, slices } = moduleObj;
    slices.forEach((slice) => {
      const reducerKey = slice.name; // Remove "Slice" suffix
      if (!reducerImportString.includes(reducerKey)) {
        if (moduleName == "main") {
          reducerImportString += `import ${reducerKey} from  "@/redux/slices/${slice.sliceName}"; \n`;
        } else {
          reducerImportString += `import ${reducerKey} from  "@/modules/${moduleName}/redux/slices/${slice.sliceName}"; \n`;
        }
      }
    });
    slices.forEach((slice) => {
      const reducerKey = slice.name; // Remove "Slice" suffix
      if (!reducerMapString.includes(reducerKey)) {
        reducerMapString += `${reducerKey},\n`;
      }
    });
  });

  reducerMapString += "\n};\n";
  fs.writeFileSync(outputJsonFile, reducerImportString + reducerMapString);
}

getModulesWithSlices();
