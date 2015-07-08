var pluginPath  = 'babel-plugin-react-hot';
var makeHotPath = pluginPath+'/makeHot';
var makeHotName = 'makeHot';
var reactPath   = 'react';
var reactName   = 'React';
var mountPath   = 'react/lib/ReactMount';
var mountName   = 'ReactMount';

function isRenderMethod (member) {
  return member.kind === 'method' &&
         member.key.name === 'render';
}

exports = module.exports = transform;
function transform (babel) {
  var t = babel.types;

  return new babel.Transformer(pluginPath, {
    /**
     * ES6 ReactComponent
     */
    ClassDeclaration: function (node, parent, scope, file) {
      var hasRenderMethod = node.body.body.filter(isRenderMethod).length > 0;
      if (!hasRenderMethod) {
        return;
      }

      var makeHot = file.addImport(makeHotPath, makeHotName,  'absolute');
      var React   = file.addImport(reactPath,   reactName,    'absolute');
      var mount   = file.addImport(mountPath,   mountName,    'absolute');

      node.decorators = node.decorators || [];
      node.decorators.push(
        t.decorator(
          t.callExpression(
            makeHot,
            [
              React,
              mount,
              t.identifier('__filename'),
              t.literal(node.id.name)
            ]
          )
        )
      );
    }
  });
}
