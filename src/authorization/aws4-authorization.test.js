// @flow

import { sign } from 'aws4';
import { parse } from 'url';

import AWS4Authorization from './aws4-authorization';

jest.mock('aws4');

const mockUrl = 'http://localhost:9000/test';
const mockAuthorizationHeader = 'AWS4-HMAC-SHA256 Credential=account/20170214/FR/service/aws4_request, SignedHeaders=host;x-amz-date, Signature=2e195c8c28f6508dbe6958c186f85ff073e6ebfd3e4af5fa46b7f2782cc64b1a';
const mockXAmzDateHeader = '20170214T140217Z';

sign.mockImplementation((obj) => {
  const parsed = parse(mockUrl);

  expect(obj.hostname).toEqual(parsed.hostname);
  expect(obj.port).toEqual(parsed.port);
  expect(obj.path).toEqual(parsed.path);

  /* eslint-disable no-param-reassign */
  obj.headers.Authorization = mockAuthorizationHeader;
  obj.headers.Host = parsed.host;
  obj.headers['X-Amz-Date'] = mockXAmzDateHeader;
});


describe('AWS4Authorization', () => {
  it('only supports "header" authentication', () => {
    // $FlowIgnore This explicitly tests handling of an invalid 'type'
    const construct = () => new AWS4Authorization('service', 'query', 'keyId', 'key');
    expect(construct).toThrowError(/header signatures/);
  });

  it('calls `aws4.sign` upon application', () => {
    const signer = new AWS4Authorization('service', 'header', 'keyId', 'key');
    signer.apply({
      method: 'GET',
      url: mockUrl,
      headers: {},
    });

    expect(sign).toHaveBeenCalled();
  });

  it('sets headers in the passed object\'s `headers` object', () => {
    const headers = {};
    const signer = new AWS4Authorization('service', 'header', 'keyId', 'key');

    const params = {
      method: 'GET',
      url: mockUrl,
      headers,
    };

    signer.apply(params);

    expect(headers).toMatchObject({
      Host: parse(params.url).host,
      Authorization: mockAuthorizationHeader,
      'X-Amz-Date': mockXAmzDateHeader,
    });
  });
});
