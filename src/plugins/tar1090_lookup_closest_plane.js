//Tool for getting getting closest aircraft to the tar1090 antenna location

import { TOOL } from '../tool.js';
import { TAR1090 } from "./connections/tar1090/tar1090.js";

const tar1090 = new TAR1090();

const name = "tar1090_lookup_closest_plane";

const description = "Looks up the closest airplane, plane, or aircraft";

const params = {};

async function tar1090_lookup_closest_plane() {
    //console.log("---- IN tar1090_lookup_closest_plane FUNCTION ---- ");
    const retObj = { content: []};
    const content = {};
    try {
        let finalText = await tar1090.findCLosestPlane();
        content.type = "text";
        content.text = finalText;
    } catch (error) {
        content.type = "text";
        content.text = `Can't currently get aircraft data. Error: ${error}`;
    } 
    retObj.content.push(content);
    //console.log("---- LEAVING tar1090_lookup_closest_plane FUNCTION ----\n", retObj);
    return retObj;
}

export const tool = new TOOL(name, description, params, tar1090_lookup_closest_plane, true);
tool.setTestFunction(testFunction);

async function testFunction() {
    console.log(await tar1090_lookup_closest_plane());
}

if (!tar1090.shouldInclude()) tool.exclude();
