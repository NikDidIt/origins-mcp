/*
    demo calls to a pihole server
*/

process.loadEnvFile('./src/plugins/connections/tar1090/tar1090.env');
const TAR1090_URL = process.env.TAR1090_URL;
const PLANE_LOOKUP_URL = "https://hexdb.io/api/v1/aircraft/";

export class TAR1090 {  

    _host = null;
    _include = true;

    constructor(host) {
        this._host = host || TAR1090_URL;

        // _host could be wrong, but if it isn't even 
        // filled in then we know it won't work
        this._include = (this._host != null);
    }

    shouldInclude() {
        return this._include;
    }

    async findCLosestPlane() {
        let typeString = "";
        let operatorString = "";
        let distance = "";

        const tempObj = await fetch(this._host + "/data/aircraft.json").then(res => res.json());
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
        const finalText = `The closest aircraft${typeString} has flight number ${closest.flight.trim()}${operatorString}. It is currently ${distance}.`;
        //console.log(finalText);
        return finalText;
    }

}
