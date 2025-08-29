//Configure Tools for Home Assistant to get information on Home Temprature

import { TOOL } from '../tool.js';
import { HAAPI } from "./connections/ha-api/ha-api.js";

const SENSOR_IN_HOME_TEMP = process.env.HAAPI_SENSOR_IN_HOME_TEMP || "";
const haapi = new HAAPI();

const name = "inside_home_temperature";

const description = "Get inside or indoor temperature for the the house";

const params = {};

async function inside_home_temperature() {
    //console.log("---- IN inside_home_temperature FUNCTION ---- ");
    
    const retObj = { content: []};
    const content = {};
    try {
        const tempObj = await haapi.getState(SENSOR_IN_HOME_TEMP);
        //console.log(tempObj);
        content.temperature = Math.round(tempObj.state * 10) / 10;
        content.unit = tempObj.attributes.unit_of_measurement;
        content.last_updated = tempObj.last_updated;
        content.type = "text";
        content.text = `The temperature in the house is currently ${Math.round(tempObj.state * 10) / 10} ${tempObj.attributes.unit_of_measurement} degrees.`;
    } catch (error) {
        content.type = "text";
        content.text = `Can't currently get temperature data. Error: ${error}`;
    } 
    retObj.content.push(content);
    //console.log("---- LEAVING inside_home_temperature FUNCTION ----\n", retObj);
    return retObj;
}

export const tool = new TOOL(name, description, params, inside_home_temperature, true);
tool.setTestFunction(testFunction);

async function testFunction() {
    console.log(await inside_home_temperature());
}

if (!haapi.shouldInclude() || SENSOR_IN_HOME_TEMP.length == 0) tool.exclude();
