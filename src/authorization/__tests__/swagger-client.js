// @flow
/* Modified by Luca Tamnburo (luca.tamburo@azatec.com) */
import SwaggerClient from 'swagger-client';

import mockSwaggerSpec from '../../../test/server/swagger.json';

import { AWS4Authorization } from '..';

const mockSwaggerUrl = 'http://localhost:9000/api/swagger.json';
const mockGetAccountUrl = 'http://localhost:9000/api/account';
const schemeName = 'sigv4';

jest.mock('superagent', () => ({
  get: jest.fn((url) => {
    const headers = {};

    return {
      set: jest.fn((name, value) => {
        headers[name] = value;
        return this;
      }),
      end: jest.fn((cb) => {
        const resultMap = {
          [mockSwaggerUrl]: mockSwaggerSpec,
          [mockGetAccountUrl]: {
            name: 'YOUR NAME GOES HERE',
          },
        };
        const result = resultMap[url];

        if (!result) {
          cb(true, {
            status: 404,
            text: 'Not found',
          });
          return;
        }
        if (url === mockGetAccountUrl
            && (!headers.Authorization
                || !headers.Authorization.match(/AWS4/)
                || !headers['X-Amz-Date'])) {
          cb(true, {
            status: 401,
            text: 'Unauthorized',
          });
          return;
        }

        cb(null, {
          status: 200,
          text: JSON.stringify(result),
        });
      }),
    };
  }),
}));

describe('SwaggerClient', () => {
  it('can connect to the server', () => new SwaggerClient({
    url: mockSwaggerUrl,
    usePromise: true,
  }));

  it('correctly detects the AWS4 security definition', () => new SwaggerClient({
    url: mockSwaggerUrl,
    usePromise: true,
  })
    .then((client) => {
      expect(client.securityDefinitions[schemeName]).toEqual(
        expect.objectContaining({
          type: 'apiKeyAws4',
          in: 'header',
          name: 'Authorization',
          'x-amazon-apigateway-authtype': 'awsSigv4',
        }),
      );
    }));

  it('can call the API service using an AWS4 signature', () => new SwaggerClient({
    url: mockSwaggerUrl,
    usePromise: true,
  })
    .then((client) => {
      const sessionToken = 'theSessionToken';
      const keyId = 'theKeyId';
      const key = 'theKey';
      const region = 'eu-west-1';
      const aws4 = client.securityDefinitions[schemeName];

      client.clientAuthorizations.add(
        schemeName,
        new AWS4Authorization(
          'execute-api', region, aws4.in, keyId, key, sessionToken));
      return client;
    })
    .then(client => client.Account.get_account())
    .then((result) => {
      expect(result.obj.name).toBe('YOUR NAME GOES HERE');
    }));
});
