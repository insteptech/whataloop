/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const modules = require("../modules.json");

const OUTPUT_FILE = path.resolve(__dirname, "../componentsMap.tsx");

function getRoutes(files, dir, moduleName) {
  let components = [];
  files.forEach((file) => {
    const relativePath = path.relative(dir, file);
    const parts = relativePath.split(path.sep);
    let componentName = path.basename(file, ".tsx"); // Extract component name (e.g., "login")
    if (componentName === "index") {
      componentName = parts[parts.length - 2];
    }
    const route = parts.join("/");
    components.push({
      name: componentName,
      path:
        moduleName && moduleName != "main"
          ? `@/modules/${moduleName}/${route.replace(".tsx", "")}`
          : `@/${route.replace(".tsx", "")}`,
    });
  });

  return components;
}

function generateComponentsMap() {
  const modulesRouter = [];
  modules.forEach((item) => {
    const MODULES_DIR = path.resolve(__dirname, `../modules/${item.name}`);
    const files = glob.sync(`${MODULES_DIR}/containers/**/*.tsx`);

    let components = getRoutes(files, MODULES_DIR, item.name);
    let routes = { module: item.name, components };

    modulesRouter.push(routes);
  });

  const MAIN_DIR = path.resolve(__dirname, `../`);
  const files = glob.sync(`${MAIN_DIR}/containers/**/*.tsx`);

  if (files && files.length > 0) {
    let components = getRoutes(files, MAIN_DIR, "main");
    let routes = { module: "main", components };
    modulesRouter.push(routes);
  }

  // Default route fallback
  let defaultRoot = "@/modules/auth/containers/login/index";

  // Start building the components map string with loader import
  let componentsMapString =
    "import dynamic from 'next/dynamic';\nimport Loader from '@/components/common/loader';\n\nexport const componentsMap = {\n";

  modulesRouter.forEach((moduleObj) => {
    const { module, components } = moduleObj;
    if (components && components.length > 0) {
      componentsMapString += `  "${module}": {\n`;
      components.forEach((component, index) => {
        // Handle dynamic route segments
        if (
          components[index + 1]?.name.startsWith("[") &&
          components[index + 1]?.name.endsWith("]")
        ) {
          componentsMapString += `    "${component.name}/${components[index + 1].name
            }": dynamic(() => import("${components[index + 1].path
            }"), { ssr: false, loading: () => <Loader /> }), \n`;
        } else if (
          component.name.startsWith("[") &&
          component.name.endsWith("]")
        ) {
          // Skip standalone dynamic segment component
          return;
        } else {
          componentsMapString += `    "${component.name}": dynamic(() => import("${component.path}"), { ssr: false, loading: () => <Loader /> }), \n`;
        }
      });
      componentsMapString += `  },\n`;
    }
  });

  componentsMapString += `  "/": dynamic(() => import("${defaultRoot}"), { ssr: false, loading: () => <Loader /> }), \n`;

  componentsMapString += "};\n";

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, componentsMapString);
}

generateComponentsMap();
