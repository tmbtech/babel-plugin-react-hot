if (typeof global === 'undefined' && typeof window !== 'undefined') {
  global = window;
}

var System = global && global.System;
var pluginPath = 'babel-plugin-react-hot';

var makeHotName = 'makeHot';
var makeHotPath = (System ? __dirname : pluginPath)+'/makeHot';

var reactName = 'React';
var reactPath = 'react';

var mountName = 'ReactMount';
var mountPath = 'react/lib/ReactMount';

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
    },

    /**
     * ReactClassComponent
     */
    CallExpression: function (node, parent, scope, file) {
      var callee = this.get('callee');
      if (node._hotDecorated || !callee.matchesPattern('React.createClass')) {
        return;
      }
      
      var makeHot = file.addImport(makeHotPath, makeHotName,  'absolute');
      var React   = file.addImport(reactPath,   reactName,    'absolute');
      var mount   = file.addImport(mountPath,   mountName,    'absolute');
      
      node._hotDecorated = true;

      return t.callExpression(
        t.callExpression(
          makeHot,
          [
            React,
            mount,
            t.identifier('__filename'),
            t.literal(node && node.id && node.id.name || '')
          ]
        ),
        [node]
      );
    }
  });
}
