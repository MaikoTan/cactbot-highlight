/* eslint-disable @typescript-eslint/naming-convention */
const Conditions = new Proxy({}, {
    get: (obj, prop) => {
        return (data: any, matches: any) => undefined;
    },
});

const Regexes = new Proxy({}, {
    get: (obj, prop) => {
        return (_: any) => new RegExp("test");
    },
});

const ZoneId = new Proxy({}, {
    get: (obj, prop) => {
        return 1;
    },
});


export {
    Conditions,
    Regexes,
    Regexes as NetRegexes,
    Conditions as Response,
    ZoneId,
};
