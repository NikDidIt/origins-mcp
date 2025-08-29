/*
    Tool class used by the plugins. This is used to pass into the MCP server at startup to load the plugins.
*/
export class TOOL {  

    _name = null
    _description = null
    _params = {}
    _function = null
    _includeInBuild = true
    _testFunction = null

    constructor(name, description, params, fun, include) {
        this._name = name;
        this._description = description;
        this._params = (params == null) ? {} : params;
        this._function = fun;
        this._includeInBuild = (include == null) ? true : include;
    }

    shouldInclude() {
        return this._includeInBuild && this._name != null && this._description != null && this._function != null;
    }

    exclude() {
        this._includeInBuild = false;
    }

    include() {
        this._includeInBuild = true;
    }

    getName() {
        return this._name;
    }

    getDescription() {
        return this._description;
    }

    getParams() {
        return this._params;
    }

    getFunction() {
        return this._function;
    }

    getTestFunction() {
        return this._testFunction;
    }

    setTestFunction(testFunction) {
        if (typeof(testFunction) === "function") {
            this._testFunction = testFunction;
        }
    }
}
