/* CSS */
require('swagger-ui/src/main/html/css/typography.css');
require('swagger-ui/src/main/html/css/reset.css');
require('swagger-ui/src/main/html/css/screen.css');
/* Omitting print media CSS */

/* Scripts */
require('swagger-ui/lib/object-assign-pollyfill.js');
require('swagger-ui/lib/jquery-1.8.0.min.js');
require('swagger-ui/lib/jquery.slideto.min.js');
require('swagger-ui/lib/jquery.wiggle.min.js');
require('swagger-ui/lib/jquery.ba-bbq.min.js');
require('swagger-ui/lib/lodash.min.js');
require('swagger-ui/lib/backbone-min.js');
require('swagger-ui/lib/highlight.9.1.0.pack.js');
require('swagger-ui/lib/highlight.9.1.0.pack_extended.js');
require('swagger-ui/lib/jsoneditor.min.js');
require('swagger-ui/lib/swagger-oauth.js');

require('swagger-ui/src/main/template/templates.js');

require('es5-shim');

require('swagger-ui/src/main/javascript/helpers/handlebars.js');
const SwaggerUi = require('swagger-ui/src/main/javascript/SwaggerUi.js');
require('swagger-ui/src/main/javascript/view/AuthsCollection.js');
require('swagger-ui/src/main/javascript/view/SignatureView.js');
require('swagger-ui/src/main/javascript/view/AuthsCollectionView.js');
require('swagger-ui/src/main/javascript/view/OperationView.js');
require('swagger-ui/src/main/javascript/view/StatusCodeView.js');
require('swagger-ui/src/main/javascript/view/ParameterView.js');
require('swagger-ui/src/main/javascript/view/ApiKeyAuthModel.js');
require('swagger-ui/src/main/javascript/view/Oauth2Model.js');
require('swagger-ui/src/main/javascript/view/HeaderView.js');
require('swagger-ui/src/main/javascript/view/BasicAuthView.js');
require('swagger-ui/src/main/javascript/view/ApiKeyAuthView.js');
require('swagger-ui/src/main/javascript/view/ResponseContentTypeView.js');
require('swagger-ui/src/main/javascript/view/MainView.js');
require('swagger-ui/src/main/javascript/view/Oauth2View.js');
require('swagger-ui/src/main/javascript/view/PopupView.js');
require('swagger-ui/src/main/javascript/view/AuthView.js');
require('swagger-ui/src/main/javascript/view/ContentTypeView.js');
require('swagger-ui/src/main/javascript/view/BasicAuthModel.js');
require('swagger-ui/src/main/javascript/view/ParameterContentTypeView.js');
require('swagger-ui/src/main/javascript/view/partials/signature.js');
require('swagger-ui/src/main/javascript/view/AuthButtonView.js');
require('swagger-ui/src/main/javascript/view/ResourceView.js');
require('swagger-ui/src/main/javascript/doc.js');
require('swagger-ui/src/main/javascript/utils/utils.js');

export default SwaggerUi;
