'use strict'
import NodeIterator from '../node-iterator'

export function textNodesUnder (node) {
  const iterator = new NodeIterator(node, 'getNextTextNode')
  return [...iterator]
}

// NOTE: if there is only one text node, then just that node and
// the abs offset are returned
export function getTextNodeAndRelativeOffset ({textNodes, absOffset}) {
  let cumulativeOffset = 0
  let relativeOffset = 0
  let targetNode
  for (let i = 0; i < textNodes.length; i++) {
    const node = textNodes[i]
    if (absOffset <= cumulativeOffset + node.textContent.length) {
      targetNode = node
      relativeOffset = absOffset - cumulativeOffset
      break
    }
    cumulativeOffset += node.textContent.length
  }
  return {node: targetNode, relativeOffset}
}

// Returns the absolute (cumulative) offset of node+nodeOffset
// within an array of textNodes.
// If node is not found in the textNodes array, returns -1.
export function getAbsoluteOffset (textNodes, node, nodeOffset) {
  let cumulativeOffset = 0
  let found = false
  for (let i = 0; i < textNodes.length; i++) {
    const textNode = textNodes[i]
    if (textNode === node) {
      cumulativeOffset += nodeOffset
      found = true
      break
    }
    cumulativeOffset += textNode.textContent.length
  }
  if (!found) {
    return -1
  }
  return cumulativeOffset
}

export function getTotalCharCount (element) {
  const textNodes = textNodesUnder(element)
  const reducer = (acc, node) => acc + node.textContent.length
  return textNodes.reduce(reducer, 0)
}
