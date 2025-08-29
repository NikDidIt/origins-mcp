//Tool for getting Home Assistant information on outside Temperature

import { TOOL } from '../tool.js';
import { HAAPI } from "./connections/ha-api/ha-api.js";

const SENSOR_OUT_HOME_TEMP = process.env.HAAPI_SENSOR_OUT_HOME_TEMP || "";
const haapi = new HAAPI();

const name = "outside_home_temperature";

const description = "Get outside or outdoor temperature for the the house";

const params = {};

async function outside_home_temperature() {
    //console.log("---- IN inside_home_temperature FUNCTION ---- ");
    const retObj = { content: []};
    const content = {};
    try {
        const tempObj = await haapi.getState(SENSOR_OUT_HOME_TEMP);
        //console.log(tempObj);
        content.temperature = tempObj.attributes.temperature;
        content.unit = tempObj.attributes.temperature_unit;
        content.last_updated = tempObj.last_updated;
        content.type = "text";
        content.text = `The temperature outside the house is currently ${tempObj.attributes.temperature} ${tempObj.attributes.temperature_unit} degrees.`;
    } catch (error) {
        content.type = "text";
        content.text = `Can't currently get temperature data. Error: ${error}`;
    } 
    retObj.content.push(content);
    //console.log("---- LEAVING inside_home_temperature FUNCTION ----\n", retObj);
    return retObj;
}

export const tool = new TOOL(name, description, params, outside_home_temperature, true);
tool.setTestFunction(testFunction);

async function testFunction() {
    console.log(await outside_home_temperature());
}

if (!haapi.shouldInclude() || SENSOR_OUT_HOME_TEMP.length == 0) tool.exclude();
