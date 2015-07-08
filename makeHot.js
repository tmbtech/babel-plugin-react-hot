var ReactHotAPI = require('react-hot-api');
var madeHot = {};

module.exports = makeHot;
function makeHot (React, ReactMount, filename, displayName) {
  var id = filename+'$$$'+displayName;

  function getRootInstances () {
    return ReactMount._instancesByReactRootID
      || ReactMount._instancesByContainerID
      || [];
  }
  
  return function (ReactClass) {
    if (!madeHot[id]) {
      madeHot[id] = ReactHotAPI(getRootInstances, React);
    }
    
    return madeHot[id](ReactClass, id);
  };
}
