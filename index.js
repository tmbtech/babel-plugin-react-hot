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
              t.literal(file.opts.filename+'$$$'+node.id.name)
            ]
          )
        )
      );
    },

    /**
     * ReactClassComponent
    CallExpression: function (node, parent, scope, file) {
      var callee = this.get('callee');
      if (!callee.matchesPattern('React.createClass')) {
        return;
      }
      
      var React = file.addImport(reactPath, reactName, 'absolute');
      var mount = file.addImport(mountPath, mountName, 'absolute');
      var hot   = file.addImport(hotPath,   hotName,   'absolute');

      callee.getStatementParent().insertAfter(
        t.assignmentExpression(
          '=',
          t.identifier(parent.id.name),
          t.callExpression(
            t.callExpression(
              hot,
              [
                t.identifier('React'),
                t.literal(file.opts.filename+'$$$'+parent.id.name)
              ]
            ),
            [t.identifier(parent.id.name)]
          )
        )
      );
    }
     */
  });
}
