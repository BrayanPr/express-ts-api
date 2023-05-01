"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conf = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Operational Administrator",
            version: "1.0.0",
            description: "Demo api REST with NODE and Typescript"
        },
        servers: [
            {
                url: "http://localhost:300"
            }
        ]
    },
    apis: ["./src/routes/swagger.documentation.yaml"]
};
exports.default = conf;
