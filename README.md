# swagger-aws
[Swagger] AWS authorization provider, and [SwaggerUI] integration

This library tracks the version of the SwaggerUI version it's tested/compatible
with, except for the `micro` part of the version number: we take the `micro`
version of the compatible SwaggerUI version, then multiply it with 100, and
increase it with 1 for every actual micro release. This permits up to 100 micro
releases of this library per micro release of SwaggerUI (which is, hopefully,
sufficient) whilst still being compatible with [Semver](http://semver.org)
(which doesn't provide a fourth version number).

## CI & Coverage
[![CircleCI](https://circleci.com/gh/scality/swagger-aws.svg?style=svg)](https://circleci.com/gh/scality/swagger-aws)
[![Coverage Status](https://coveralls.io/repos/github/scality/swagger-aws/badge.svg?branch=master)](https://coveralls.io/github/scality/swagger-aws?branch=master)

## Usage
### Declaring AWS4 authorization support
[AWS4 signatures] are not a supported authorization mechanism part of the
[OpenAPI specification]. This package assumes an API exposes support for this
authorization mechanism, defined in the `securityDefinitions` section of the
API specification, as follows:

- `type`: `x-aws4`
- `x-in`: `header` (currently only header-based signatures are supported)
- `x-service`: name of the service
- `x-region`: region of the service

Standard fields like `description` are supported as well.

### Using the AWS4 authorization provider
The AWS4 authorization provider can be used by including
`SwaggerAws.Authorization`, after which the provider is available as
`AWS4Authorization`. It can be used as follows:

```javascript
// Value of the `x-service` field in the API spec
var service = 'api';
var region = 'be-east-2';
var keyId = 'myKeyId';
var key = 'myKey';

var aws4 = new AWS4Authorization(service, region, 'header', keyId, key);

// Name of the security definition as defined in the API spec
var schemeName = 'aws4Auth';
swaggerClient.clientAuthorizations.add(schemeName, aws4);
```

### Integrating with SwaggerUI
To add AWS4 signature support to SwaggerUI, include both
`SwaggerAws.Authoriziation` and `SwaggerAws.Ui` (in that order) in the HTML
page hosting SwaggerUI. Note these need to be added *after* the SwaggerUI
script and all of its dependencies have been loaded. Then, call
`SwaggerAws.Ui.patch()` to monkey-patch the support in the UI.

```html
<!-- This goes after inclusion of `swagger-ui.js` and it dependencies -->
<script src='SwaggerAws.Authorization.min.js' type='text/javascript'></script>
<script src='SwaggerAws.Ui.min.js' type='text/javascript'></script>
<script type='text/javascript'>
SwaggerAws.Ui.patch();
</script>
```

## Development
To develop, first install any dependencies using `npm install`. Note this
library lists all libraries coming with the target SwaggerUI and used directly
by the library code as `peerDependencies` in `package.json`. This lists a
version of [JQuery] which is not available through [NPM]. As such a warning is
displayed. This should be harmless because the installed version of JQuery is
not directly used.

To build the library, execute `npm run build`, which will build the artifacts
using [Webpack].

To test the SwaggerUI integration manually, run `npm start` which will launch a
demo on [http://localhost:8080](http://localhost:8080).

To run tests, run `npm test`. This will lint the code using [ESLint], type-check
using [Flow] and run a couple of [Jest] tests.

Finally, a couple of end-to-end browser-based tests are included using
[NightwatchJS]. These can be executed using `npm run e2e`.

[Swagger]: http://swagger.io
[SwaggerUI]: http://swagger.io/swagger-ui/
[AWS4 signatures]: http://docs.aws.amazon.com/general/latest/gr/signature-version-4.html
[OpenAPI specification]: http://swagger.io/specification/

[JQuery]: https://jquery.com
[NPM]: https://www.npmjs.com
[Webpack]: https://webpack.js.org
[ESLint]: http://eslint.org
[Flow]: https://flowtype.org
[Jest]: https://facebook.github.io/jest/
[NightwatchJS]: http://nightwatchjs.org
