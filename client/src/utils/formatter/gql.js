import { parse } from 'graphql';

class Text {
  constructor() {
    this.lines = [[]];
    this.currentIndent = 0;
    this.currentModifiers = {};
  }
  static TYPE = 0;
  static VALUE = 1;
  static MODIFIERS = 2;

  indent(off = 1) {
    this.currentIndent += off;
    return this;
  }
  outdent(off = 1) {
    if (this.currentIndent > off) {
      this.currentIndent -= off;
    } else {
      this.currentIndent = 0;
    }
    return this;
  }

  newLine() {
    this.lines.push([]);
    return this;
  }

  addModifiers(modifiers) {
    this.currentModifiers = {
      ...this.currentModifiers,
      ...modifiers,
    };
  }
  removeModifiers(modifiers) {
    this.currentModifiers = { ...this.modifiers };
    Object.keys(modifiers).forEach((key) => {
      delete this.currentModifiers[key];
    });
  }

  addNode(type, value) {
    const line = this.lines[this.lines.length - 1];

    const node = line[line.length - 1];
    if (
      !node ||
      node[Text.TYPE] !== type ||
      node[Text.MODIFIERS] !== this.currentModifiers
    ) {
      if (!node && this.currentIndent) {
        line.push(['indent', this.currentIndent]);
      }

      line.push([type, value, this.currentModifiers]);
    } else {
      node[Text.VALUE] = node[Text.VALUE] + value;
    }

    return this;
  }

  raw() {
    return this.lines;
  }
}

const applyGqlNode = (node, text) => {
  if (!node) {
    return;
  }

  switch (node.kind) {
    case 'Document': {
      node.definitions.forEach((defNode) => applyGqlNode(defNode, text));
      break;
    }

    case 'NamedType': {
      text.addModifiers({ type: true });
      applyGqlNode(node.name, text);
      text.removeModifiers({ type: true });
      break;
    }
    case 'Name': {
      text.addNode('name', node.value);
      break;
    }
    case 'BooleanValue': {
      text.addNode('bool', node.value.toString());
      break;
    }
    case 'StringValue': {
      text.addNode('string', `"${node.value}"`);
      break;
    }
    case 'FloatValue':
    case 'IntValue': {
      text.addNode('number', node.value.toString());
      break;
    }

    case 'OperationDefinition': {
      text.addNode('op', node.operation).addNode('space', ' ');
      applyGqlNode(node.name, text);
      if (node.variableDefinitions && node.variableDefinitions.length) {
        text.addNode('variable-definition-start', '(');
        node.variableDefinitions.forEach((defNode, index) => {
          if (index) {
            text.addNode('text', ', ');
          }
          applyGqlNode(defNode, text);
        });
        text.addNode('variable-definition-end', ')');
      }

      applyGqlNode(node.selectionSet, text);
      text.newLine();
      break;
    }
    case 'SelectionSet': {
      if (node.selections.length > 0) {
        text.addNode('space', ' ').addNode('selection-start', '{').indent();
        node.selections.forEach((selectionNode) => {
          applyGqlNode(selectionNode, text);
        });
        text.outdent().newLine().addNode('selection-end', '}');
      }
      break;
    }
    case 'FragmentDefinition': {
      text.addNode('fragment', 'fragment').addNode('space', ' ');
      applyGqlNode(node.name, text);
      text
        .addNode('space', ' ')
        .addNode('fragmentOn', 'on')
        .addNode('space', ' ');
      applyGqlNode(node.typeCondition, text);
      applyGqlNode(node.selectionSet, text);
      text.newLine();
      break;
    }
    case 'FragmentSpread': {
      text.newLine().addNode('fragmentSpread', '...');
      applyGqlNode(node.name, text);
      break;
    }

    case 'Field': {
      text.newLine();
      applyGqlNode(node.name, text);
      if (node.arguments && node.arguments.length) {
        text.addNode('args-start', '(');
        node.arguments.forEach((argNode, index) => {
          if (index) {
            text.addNode('text', ', ');
          }
          applyGqlNode(argNode, text);
        });
        text.addNode('args-end', ')');
      }
      applyGqlNode(node.selectionSet, text);
      break;
    }
    case 'Argument': {
      text.addModifiers({ arg: true });
      applyGqlNode(node.name, text);
      text.removeModifiers({ arg: true });

      text.addNode('text', ': ');

      text.addModifiers({ variable: true });
      applyGqlNode(node.value, text);
      text.removeModifiers({ variable: true });
      break;
    }
    case 'VariableDefinition': {
      text.addModifiers({ variable: true });
      applyGqlNode(node.variable, text);
      text.removeModifiers({ variable: true });

      text.addNode('text', ': ');
      applyGqlNode(node.type, text);
      break;
    }
    case 'ListType': {
      applyGqlNode(node.type, text);
      break;
    }
    case 'Variable': {
      text.addNode('var-prefix', '$');
      applyGqlNode(node.name, text);
      break;
    }
    default: {
      console.log('Unknow node', node);
    }
  }
};

// const formatText = (textRaw) => {
//   return textRaw
//     .map((nodes) =>
//       nodes
//         .map(([type, value]) => {
//           if (type === 'indent') {
//             return ''.padEnd(value, '  ');
//           } else {
//             return value;
//           }
//         })
//         .join('')
//     )
//     .join('\n');
// };

export const formatGql = (query) => {
  const parsed = parse(query, { noLocation: true });

  const text = new Text();
  applyGqlNode(parsed, text);

  return text.raw();
};
