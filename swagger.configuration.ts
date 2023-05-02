import swaggerJSDoc from 'swagger-jsdoc'

const conf:swaggerJSDoc.Options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Operational Administrator",
            version:"1.0.0",
            description:"Demo api REST with NODE and Typescript"
        },
        servers:[
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./src/routes/swagger.documentation.yaml"]
}

export default conf