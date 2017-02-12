/* global describe, expect, it, jest */

import { sign } from 'aws4';

import AWS4Authorization from './aws4-authorization';

jest.mock('aws4', () => ({
  sign: jest.fn(() => ({
    headers: {
      Authorization: 'AWS4-HMAC-SHA256 Credential=account/20170212/FR/service/aws4_request, SignedHeaders=host;x-amz-date, Signature=2e195c8c28f6508dbe6958c186f85ff073e6ebfd3e4af5fa46b7f2782cc64b1a',
      'X-Amz-Date': '20170212T231620Z',
    },
  })),
}));


describe('AWS4Authorization', () => {
  it('only supports "header" authentication', () => {
    const construct = () => new AWS4Authorization('service', 'query', 'keyId', 'key');
    expect(construct).toThrow(/header signatures/);
  });

  it('calls `aws4.sign` upon application', () => {
    const signer = new AWS4Authorization('service', 'header', 'keyId', 'key');
    signer.apply({
      method: 'GET',
      url: 'http://localhost:9000/demo',
      headers: {},
    });

    expect(sign).toHaveBeenCalled();
  });
});
