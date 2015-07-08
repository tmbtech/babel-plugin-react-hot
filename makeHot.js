var ReactHotAPI = require('react-hot-api');
var madeHot = {};

module.exports = makeHot;
function makeHot (React, ReactMount, id) {
  function getRootInstances () {
    return ReactMount._instancesByReactRootID
      || ReactMount._instancesByContainerID
      || [];
  }

  return function (ReactClass) {
    if (!madeHot[id]) {
      madeHot[id] = ReactHotAPI(getRootInstances, React)(ReactClass, id);
    }

    return madeHot[id];
  };
}
