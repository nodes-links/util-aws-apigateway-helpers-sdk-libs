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
exports.utils = {
    assertDefined: function (object, name) {
        if (object === undefined) {
            // tslint:disable-next-line: no-string-throw
            throw name + ' must be defined';
        }
        else {
            return object;
        }
    },
    assertParametersDefined: function (params, keys, ignore) {
        if (keys === undefined) {
            return;
        }
        if (keys.length > 0 && params === undefined) {
            params = {};
        }
        for (let i = 0; i < keys.length; i++) {
            if (!exports.utils.contains(ignore, keys[i])) {
                exports.utils.assertDefined(params[keys[i]], keys[i]);
            }
        }
    },
    parseParametersToObject: function (params, keys) {
        if (params === undefined) {
            return {};
        }
        const object = {};
        for (let i = 0; i < keys.length; i++) {
            object[keys[i]] = params[keys[i]];
        }
        return object;
    },
    contains: function (a, obj) {
        if (a === undefined) {
            return false;
        }
        let i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    },
    copy: function (obj) {
        if (null == obj || 'object' !== typeof obj)
            return obj;
        const copy = obj.constructor();
        for (const attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = obj[attr];
        }
        return copy;
    },
    mergeInto: function (baseObj, additionalProps) {
        if (null == baseObj || 'object' !== typeof baseObj)
            return baseObj;
        const merged = baseObj.constructor();
        for (const attr in baseObj) {
            if (baseObj.hasOwnProperty(attr))
                merged[attr] = baseObj[attr];
        }
        if (null == additionalProps || 'object' !== typeof additionalProps)
            return baseObj;
        for (const attr in additionalProps) {
            if (additionalProps.hasOwnProperty(attr))
                merged[attr] = additionalProps[attr];
        }
        return merged;
    }
};
//# sourceMappingURL=utils.js.map