/*
    Checks against pihole network device list to find computer 
    name based on the last part of the ip address.
*/

import { TOOL } from '../tool.js';
import { PIHOLE } from "./connections/pi-hole/pi-hole.js";
import { z } from "zod";

const pihole = new PIHOLE();

const name = "pihole_find_by_ip";

const description = "Find a computer name by the final number in the ip address";

const params = {
    final_num: z.number().describe("A number between 1 and 255")
};

async function pihole_find_by_ip( args ) {
    //console.log("---- IN pihole_find_by_ip FUNCTION ---- ", args);
    const retObj = { content: []};
    const content = {};
    try {
        let computers = [];
        const tempObj = await pihole.getNetworkDevices();
        //console.log("tempObj: "+JSON.stringify(tempObj, null, 2));
        if (tempObj.devices != null) {
            tempObj.devices.forEach(device => {
                device.ips.forEach(ip => {
                    if (ip.ip.endsWith("."+args.final_num)) {
                        if (ip.name == null) {
                            computers.push("a nameless computer associated with "+device.macVendor);
                        } else {
                            computers.push(ip.name);
                        }
                    }
                })
            });
        }
        //console.log("computers: ",computers);
        if (computers.length == 0) computers.push("not available. No computers have an IP address ending in "+args.final_num);
        content.type = "text";
        content.text = `The computer you are looking for is ${computers.join(", ")}`;
    } catch (error) {
        content.type = "text";
        content.text = `Can't find the computer name. Error: ${error}`;
    } 
    
    retObj.content.push(content);
    //console.log("---- LEAVING pihole_find_by_ip FUNCTION ----\n", retObj, pihole._token);
    return retObj;
}

export const tool = new TOOL(name, description, params, pihole_find_by_ip, true);
tool.setTestFunction(testFunction);

async function testFunction() {
    const TEST_DATE = process.env.PIHOLE_FIND_BY_IP_TESTS || "1";
    const SPLIT_TEST_DATA = TEST_DATE.split(",");
    for(let ip of SPLIT_TEST_DATA) {
        console.log(ip+": ",await pihole_find_by_ip({final_num: ip}));
    }
}

if (!pihole.shouldInclude()) tool.exclude();
