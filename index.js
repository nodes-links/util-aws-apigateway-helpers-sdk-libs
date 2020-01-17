"use strict";
/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sigV4Client_1 = require("./sigV4Client");
const simpleHttpClient_1 = require("./simpleHttpClient");
const utils_1 = require("./utils");
exports.apiGateway = {};
exports.apiGateway.core = exports.apiGateway.core || {};
exports.apiGateway.core.apiGatewayClientFactory = {};
exports.apiGateway.core.apiGatewayClientFactory.newClient = function (simpleHttpClientConfig, sigV4ClientConfig) {
    const apiGatewayClient = {};
    //Spin up 2 httpClients, one for simple requests, one for SigV4
    exports.apiGateway.core.sigV4ClientFactory = sigV4Client_1.sigV4ClientFactory;
    const sigV4Client = exports.apiGateway.core.sigV4ClientFactory.newClient(sigV4ClientConfig);
    exports.apiGateway.core.simpleHttpClientFactory = simpleHttpClient_1.simpleHttpClientFactory;
    const simpleHttpClient = exports.apiGateway.core.simpleHttpClientFactory.newClient(simpleHttpClientConfig);
    exports.apiGateway.core.utils = utils_1.utils;
    apiGatewayClient.makeRequest = function (request, authType, additionalParams, apiKey) {
        //Default the request to use the simple http client
        let clientToUse = simpleHttpClient;
        //Attach the apiKey to the headers request if one was provided
        if (apiKey !== undefined && apiKey !== '' && apiKey !== null) {
            request.headers['x-api-key'] = apiKey;
        }
        if (request.body === undefined ||
            request.body === '' ||
            request.body === null ||
            Object.keys(request.body).length === 0) {
            request.body = undefined;
        }
        // If the user specified any additional headers or query params that may not have been modeled
        // merge them into the appropriate request properties
        request.headers = exports.apiGateway.core.utils.mergeInto(request.headers, additionalParams.headers);
        request.queryParams = exports.apiGateway.core.utils.mergeInto(request.queryParams, additionalParams.queryParams);
        //If an auth type was specified inject the appropriate auth client
        if (authType === 'AWS_IAM') {
            clientToUse = sigV4Client;
        }
        //Call the selected http client to make the request, returning a promise once the request is sent
        return clientToUse.makeRequest(request);
    };
    return apiGatewayClient;
};
exports.generateSdk = (apiKey, rootPath) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const AWS = require('aws-sdk');
    const ssm = new AWS.SSM({ region: 'eu-west-1' });
    const shell = require('shelljs');
    const fs = require('fs');
    const path = require('path');
    const JSZip = require('jszip');
    const apiId = (yield ssm.getParameter({ Name: apiKey }).promise()).Parameter.Value;
    const zipName = `sdk.zip`;
    const contents = `
  aws apigateway get-sdk \
            --rest-api-id ${apiId} \
            --stage-name prod \
            --sdk-type javascript \
            ${zipName}
  `;
    const shellFilename = 'download-sdk.sh';
    fs.writeFileSync(shellFilename, contents);
    shell.exec(`sh ${shellFilename}`);
    fs.unlinkSync(shellFilename);
    fs.readFile(zipName, (err, data) => {
        if (err)
            throw err;
        const zip = new JSZip();
        zip.loadAsync(data).then((zipContents) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const filename = Object.keys(zipContents.files).find(file => file.endsWith('apigClient.js'));
            const sdkContents = `

      import uritemplate = require('uritemplate');
      import { apiGateway } from '@nodes-links/util-aws-apigateway-helpers-sdk-libs';

      ${(yield zipContents.file(filename).async('string'))
                .replace(`var apigClientFactory = {};`, `export const apigClientFactory:any = {};`)
                .replace(`var apigClient = { };`, `const apigClient:any = { };`)
                .replace(/uritemplate/g, `uritemplate.parse`)}
      `;
            fs.writeFileSync(path.join(rootPath, `sdk.ts`), sdkContents);
            fs.unlinkSync(zipName);
        }));
    });
});
//# sourceMappingURL=index.js.map