/*
    demo calls to a pihole server
*/

process.loadEnvFile('./src/plugins/connections/pi-hole/pi-hole.env');
const PIHOLE_HOST = process.env.PIHOLE_HOST;
const PIHOLE_PASS = process.env.PIHOLE_PASS;

export class PIHOLE {  

    _host = null;
    _pass = null;
    _token = null;
    _include = true;

    constructor(host, token) {
        this._host = host || PIHOLE_HOST;
        this._pass = token || PIHOLE_PASS;

        // _host and _pass could be wrong, but if they aren't even 
        // filled in then we know it won't work
        this._include = (this._host != null && this._pass != null);
    }

    shouldInclude() {
        return this._include;
    }

    async getToken() {
        let result = await fetch(`${this._host}/api/auth`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'password': this._pass
            })
        }).then(res => res.json());

        if (result.error != null) { //had a problem
            this._token = null;
            throw new Error(result.error.message);
        }

        if (result.session.valid) {
            this._token = result.session.sid;
            return this._token;
        } else {
            this._token = null;
            throw new Error(result.session.message);
        }
    }

    async getNetworkDevices() {
        if (!this._checkTokenGood()) await this.getToken();
        if (!this._checkTokenGood()) return {}; //failed, not logged in?
        const resultDevices = await fetch(`${this._host}/api/network/devices?max_devices=255&max_addresses=3`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'sid': this._token
            }
        }).then(res => res.json());

        await this.logout();
        return resultDevices;
    }

    _checkTokenGood() {
        const retVal = this._token == null ? false : true;
        return retVal;
    }

    async logout() {
        const result = await fetch(`${this._host}/api/auth`, { 
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                "sid": this._token 
            }
        });
        this._token == null;
        return result;
    }

}
