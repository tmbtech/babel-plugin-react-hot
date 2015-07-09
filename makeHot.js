var ReactHotAPI = require('react-hot-api');
var madeHot = {};

module.exports = makeHot;
function makeHot (React, ReactMount, filename, displayName, create) {
  var id = filename+'$$$'+displayName;

  function getRootInstances () {
    return ReactMount._instancesByReactRootID
      || ReactMount._instancesByContainerID
      || [];
  }
  
  function decorator (ReactClass) {
    if (!madeHot[id]) {
      madeHot[id] = ReactHotAPI(getRootInstances, React);
    }
    
    return madeHot[id](ReactClass, id);
  }

  function createClass (obj) {
    return decorator(React.createClass(obj));
  }

  return create ? createClass : decorator;
}
