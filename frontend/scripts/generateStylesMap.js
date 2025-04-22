/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const modules = require("../modules.json");

// Path to the imports.scss file
const IMPORTS_SCSS_PATH = path.resolve(__dirname, "../styles/imports.scss");

// Function to scan a directory and generate import statements
function scanAndGenerateImports(dirPath, relativePathPrefix = "") {
    const importStatements = [];
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);

        // Filter for .scss files, excluding imports.scss itself
        const scssFiles = files.filter(
            (file) => file.endsWith(".scss") && file !== "imports.scss"
        );

        // Generate relative import paths
        scssFiles.forEach((scssFile) => {
            const relativePath = `${relativePathPrefix}${scssFile}`;
            importStatements.push(`@import "${relativePath}";`);
        });
    }
    return importStatements;
}

function generateImportsScss() {
    let importStatements = [];

    // Step 1: Scan the root styles folder
    const rootStylesDir = path.resolve(__dirname, "../styles");
    importStatements = importStatements.concat(
        scanAndGenerateImports(rootStylesDir, "./")
    );

    // Step 2: Scan each module's styles folder
    modules.forEach((module) => {
        const moduleStylesDir = path.resolve(
            __dirname,
            `../modules/${module.name}/styles`
        );
        importStatements = importStatements.concat(
            scanAndGenerateImports(moduleStylesDir, `../modules/${module.name}/styles/`)
        );
    });

    // Step 3: Write all import statements to imports.scss (overwrite mode)
    fs.writeFileSync(IMPORTS_SCSS_PATH, importStatements.join("\n"), "utf-8");
    console.log(
        `Generated imports.scss with ${importStatements.length} import statements.`
    );
}

generateImportsScss();
