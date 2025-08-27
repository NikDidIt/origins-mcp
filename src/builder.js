/*
  Builds the "sysgen" file to help with loading imports for the plugins
*/

import fs from 'fs';

const toolsPath = './src/plugins'
const runtimePath = './plugins'

let buildList = [];
buildList.push(`export const dynamicTools = {};\n`);
buildList.push(`console.log("Loading Tools:");\n`);
try {
  const files = fs.readdirSync(toolsPath);
  files.forEach(file => {
    //console.log(file.split('.')[0]);
    let fileParts = file.split('.');
    let toolFile = fileParts[0];
    let ext = fileParts[fileParts.length-1];
    if (ext == "js") {
        const fullPath = runtimePath + "/" + file;

        buildList.push(`import * as ${toolFile} from '${fullPath}'`);
        buildList.push(`console.log("  - ", ${toolFile}.tool.getName(), " loaded!");`);
        buildList.push(`dynamicTools.${toolFile} = ${toolFile}.tool\n`);
    }
  });
} catch (err) {
  console.error('Error reading directory:', err);
}

buildList.push(`//console.log(JSON.stringify(dynamicTools, null, 2));`);

fs.writeFileSync('./src/sysgen_tools.js', buildList.join('\n'));

console.log(buildList.join('\n'));

