"use strict";
var swaggerAutogen = require('swagger-autogen')();
var outputFile = './routes/swagger_output.json';
var endpointsFiles = ['./routes.ts'];
var doc = {
    info: {
        version: "1.0.0",
        title: "Our API (to define)",
        description: "SDE final project automated documentation"
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "User",
            "description": "Endpoints"
        }
    ],
    securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api_key",
            in: "header"
        },
        petstore_auth: {
            type: "oauth2",
            authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
            flow: "implicit",
            scopes: {
                read_pets: "read your pets",
                write_pets: "modify pets in your account"
            }
        }
    },
    definitions: {
        Externals: {
            $gameName: $gameName,
            $gameId: $gameId,
            steamId: steamId,
            gogId: gogId,
            twitchId: twitchId,
            itad_plain: itad_plain
        },
        User: {
            googleId: googleId,
            displayName: displayName,
            firstName: firstName,
            lastName: lastName,
            image: image,
            createdAt: createdAt
        },
    }
};
swaggerAutogen(outputFile, endpointsFiles).then(function () {
    require('./build/routes/index.js');
});
