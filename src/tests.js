/*
Runs test function associated with plugins
*/
import { dynamicTools } from './sysgen_tools.js'

for (const tool in dynamicTools) {
    if (dynamicTools.hasOwnProperty(tool)) {
        const t = dynamicTools[tool];
        if (t.shouldInclude() && t.getTestFunction() != null && typeof(t.getTestFunction()) === 'function') {
            //server.tool(t.getName(), t.getDescription(), t.getParams(), t.getFunction());
            const testFun = t.getTestFunction();
            console.log("Running test for "+t.getName());
            await testFun();
            console.log("Completing test for "+t.getName());
        } else {
            console.log("Skipping "+t.getName()+". No test function or not included.")
        }
    }
}