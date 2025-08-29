//Tool for Home Assistant information on items currently being watched on plex

import { TOOL } from '../tool.js';
import { HAAPI } from "./connections/ha-api/ha-api.js";

const PLEX_ENTITY_ID_LOOKUP = process.env.HAAPI_PLEX_ENTITY_ID_LOOKUP || "";
const haapi = new HAAPI();

const name = "plex_watching";

const description = "Get a list of items that are currently playing in plex or plex media player";

const params = {};

async function plex_watching() {
    //console.log("---- IN plex_watching FUNCTION ---- ");
    const retObj = { content: []};
    const content = {};
    try {
        const instAry = await getPlexInstances();
        let str = "";
        //console.log(instAry);
        if (instAry.length === 0) {
            str = "No items are currently playing in plex";
        } else {
            str = "Currently playing items in plex are: ";
            for (let i = 0; i < instAry.length; i++) {
                str += "\n* " + instAry[i];
            }
        }
        content.type = "text";
        content.text = str;
    } catch (error) {
        content.type = "text";
        content.text = `Can't currently get plex data. Error: ${error}`;
    } 
    retObj.content.push(content);
    //console.log("---- LEAVING plex_watching FUNCTION ----\n", retObj);
    return retObj;
}


async function getPlexInstances() {
    const response = await haapi.getStates();
    //console.log(response);
    const instances = [];
    response.forEach(element => {
        if (element.entity_id.startsWith(PLEX_ENTITY_ID_LOOKUP)) {
            if (element.attributes.media_title !== undefined) {
                instances.push(element.attributes.media_title);
            }
        }
    });
        
    return instances;
}

export const tool = new TOOL(name, description, params, plex_watching, true);
tool.setTestFunction(testFunction);

async function testFunction() {
    console.log(await plex_watching());
}

if (!haapi.shouldInclude() || PLEX_ENTITY_ID_LOOKUP.length == 0) tool.exclude();