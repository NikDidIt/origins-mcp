/*
    A few demo calls to a Home Assiastant server
*/
process.loadEnvFile('./src/plugins/connections/ha-api/ha-api.env');
const HAAPI_HOST = process.env.HAAPI_HOST;
const HAAPI_TOKEN = process.env.HAAPI_TOKEN;

export class HAAPI {  

    _host = null;
    _token = null;

    constructor(host, token) {
        this._host = host || HAAPI_HOST;
        this._token = token || HAAPI_TOKEN;
    }

    async getStatus() {
        return fetch(`${this._host}/api/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
    }

    async getStates() {
        return fetch(`${this._host}/api/states`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
    }

    async getState(id) {
        return fetch(`${this._host}/api/states/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
    }
}
