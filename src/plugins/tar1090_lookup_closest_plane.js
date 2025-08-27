//Tool for getting getting closest aircraft to the tar1090 antenna location

const TAR1090_URL = process.env.TAR1090_URL || "http://192.168.0.191/tar1090";
const PLANE_LOOKUP_URL = "https://hexdb.io/api/v1/aircraft/";

import { TOOL } from '../tool.js';
//import { z } from "zod";

const name = "tar1090_lookup_closest_plane";

const description = "Looks up the closest airplane, plane, or aircraft";

const params = {};

async function tar1090_lookup_closest_plane() {
    //console.log("---- IN tar1090_lookup_closest_plane FUNCTION ---- ");
    const retObj = { content: []};
    const content = {};
    try {
        let typeString = "";
        let operatorString = "";
        let distance = "";

        const tempObj = await fetch(TAR1090_URL + "/data/aircraft.json").then(res => res.json());
        let closest = tempObj.aircraft.toSorted((a, b) => a.r_dst - b.r_dst)[0];
        distance = closest.r_dst + " nautical miles away at an altitude of "+closest.alt_geom+"ft";
        //console.log(closest);
        const planeInfo = await fetch(PLANE_LOOKUP_URL+closest.hex).then(res => res.json());
        //console.log(planeInfo);
        if (planeInfo.Manufacture != null) {
            typeString = " is a "+planeInfo.Manufacture + " " + planeInfo.Type;
        }
        if (planeInfo.RegisteredOwners != null) {
            operatorString = " operated by "+planeInfo.RegisteredOwners;
        }
        let finalText = `The closest aircraft${typeString} has flight number ${closest.flight.trim()}${operatorString}. It is currently ${distance}.`;
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

//testFunction();