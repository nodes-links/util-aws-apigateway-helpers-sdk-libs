"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleHttpClientFactory = void 0;
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
const utils_1 = require("./utils");
const axios = require('axios');
exports.simpleHttpClientFactory = {};
exports.simpleHttpClientFactory.newClient = function (config) {
    function buildCanonicalQueryString(queryParams) {
        //Build a properly encoded query string from a QueryParam object
        if (Object.keys(queryParams).length < 1) {
            return '';
        }
        let canonicalQueryString = '';
        for (const property in queryParams) {
            if (queryParams.hasOwnProperty(property)) {
                canonicalQueryString += encodeURIComponent(property) + '=' + encodeURIComponent(queryParams[property]) + '&';
            }
        }
        return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
    }
    const simpleHttpClient = {};
    simpleHttpClient.endpoint = utils_1.utils.assertDefined(config.endpoint, 'endpoint');
    simpleHttpClient.makeRequest = function (request) {
        const verb = utils_1.utils.assertDefined(request.verb, 'verb');
        const path = utils_1.utils.assertDefined(request.path, 'path');
        let queryParams = utils_1.utils.copy(request.queryParams);
        if (queryParams === undefined) {
            queryParams = {};
        }
        let headers = utils_1.utils.copy(request.headers);
        if (headers === undefined) {
            headers = {};
        }
        //If the user has not specified an override for Content type the use default
        if (headers['Content-Type'] === undefined) {
            headers['Content-Type'] = config.defaultContentType;
        }
        //If the user has not specified an override for Accept type the use default
        if (headers['Accept'] === undefined) {
            headers['Accept'] = config.defaultAcceptType;
        }
        let body = utils_1.utils.copy(request.body);
        if (body === undefined) {
            body = '';
        }
        let url = config.endpoint + path;
        const queryString = buildCanonicalQueryString(queryParams);
        if (queryString !== '') {
            url += '?' + queryString;
        }
        const simpleHttpRequest = {
            method: verb,
            url: url,
            headers: headers,
            data: body
        };
        return axios(simpleHttpRequest);
    };
    return simpleHttpClient;
};
//# sourceMappingURL=simpleHttpClient.js.map