import ModelViewerElementBase from '../model-viewer-base.js';
import { ModelNode } from '../three-components/ModelNode.js';

const $modelNodeMap = Symbol('modelNodeMap');
const $addModelNode = Symbol('addModelNode');

export interface MultipleInterface {

}

export const MultipleMixin = <T extends Constructor<ModelViewerElementBase>>(
  ModelViewerElement: T): Constructor<MultipleInterface> & T => {
  class MultipleModelViewerElement extends ModelViewerElement {
    private[$modelNodeMap]: Map<string, ModelNode> = new Map();
    private[$addModelNode](node: Node) {
      if (!(node instanceof HTMLElement &&
        node.nodeName.toLowerCase() !== 'model-node')) {
          return;
      }

      let modelNode = this[$modelNodeMap].get(node.getAttribute('name') || '');

      if (modelNode != null) {
        modelNode.increment();
      } else {
        modelNode = new ModelNode();
      }
    }
  }

  return MultipleModelViewerElement;
};