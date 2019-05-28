// @flow

export const addAttributeToNodes = (node: Object, additionalAttr: Object) => {
  if (node) {
    node = {
      ...node,
      children: node.children.map(v => addAttributeToNodes(v, additionalAttr)),
      attributes: {
        ...node.attributes,
        ...additionalAttr
      }
    };
  }
  return node;
};

export const findNode = (tree: Array, position: Array) => {
  let node = tree[position[0]];
  if (position.length === 1) {
    return { parent: null, node: node };
  }
  for (let i = 1; i < position.length - 1; i++) {
    node = node.children[position[i]];
  }
  return { parent: node, node: node.children[position[position.length - 1]] };
};

export const pruneNode = (tree: Array, position: Array) => {
  const { parent, node } = findNode(tree, position);
  parent.children[position[position.length - 1]] = {
    attributes: { ...node.attributes, pruned: true },
    name: `${node.name}`,
    children: []
  };
};

export const formatName = (name: Object) => {
  const leq = name.lowerBound ? `${name.lowerBound} \u2264 ` : "";
  const geq = name.upperBound ? ` \u2264 ${name.upperBound}` : "";
  return `${leq}${name.variableName}${geq}`;
};

export const addTensorMessage = (tree: Array, position: Array, dataset: string, data: Array) => {
  const { parent, node } = findNode(tree, position);
  if (!parent || !node) return;
  parent.children[position[position.length - 1]] = {
    ...node,
    attributes: {
      ...node.attributes,
      [dataset]: data
    }
  };
};

export const addNodeToTree = (tree: Array, position: Array, name: Array, attributes: Object) => {
  let newNode = {
    name: name ? formatName(name[0]) : "root",
    attributes: {
      ...attributes,
      position
    },
    children: []
  };
  if (position.length === 1) {
    tree[position[0]] = newNode;
    return;
  }
  let node = tree[position[0]];
  // -1 because last element is used for inserting
  for (let i = 1; i < position.length - 1; i++) {
    node = node.children[position[i]];
    if (!node) {
      node = { children: [] };
    }
  }
  const nodeAssigned = node.children[position[position.length - 1]];
  if (nodeAssigned) {
    newNode = {
      ...newNode,
      children: nodeAssigned.children
    };
  }
  node.children[position[position.length - 1]] = newNode;
};
