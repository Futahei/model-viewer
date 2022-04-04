import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { normalizeUnit } from "../styles/conversions";
import { NumberNode, parseExpressions } from "../styles/parsers";

/**
 * Hotspots are configured by slot name, and this name must begin with "hotspot"
 * to be recognized. The position and normal strings are in the form of the
 * camera-target attribute and default to "0m 0m 0m" and "0m 1m 0m",
 * respectively.
 */
 export interface ModelNodeConfiguration {
  name: string;
  position?: string;
  orientation?: string;
}

export class ModelNode extends CSS2DObject {
  public name = '';
  private referenceCount = 1;

  constructor(config: ModelNodeConfiguration) {
    super(document.createElement('div'));


    this.name = config.name;

    this.updatePosition(config.position);
    this.updateOrientation(config.orientation);
  }

  /**
   * Call this when adding elements to the same name to keep track.
   */
  increment() {
    this.referenceCount++;
  }

  /**
   * Call this when removing elements from the name; returns true when the slot
   * is unused.
   */
  decrement(): boolean {
    if (this.referenceCount > 0) {
      --this.referenceCount;
    }
    return this.referenceCount === 0;
  }

  /**
   * Change the position of the modelNode to the input string, in the same format
   * as the data-position attribute.
   */
  updatePosition(position?: string) {
    if (position == null)
      return;
    const positionNodes = parseExpressions(position)[0].terms;
    for (let i = 0; i < 3; ++i) {
      this.position.setComponent(
          i, normalizeUnit(positionNodes[i] as NumberNode<'m'>).number);
    }
    this.updateMatrixWorld();
  }

  /**
   * Change the modelNode's orientation to the input string
   */
  updateOrientation(orientation?: string) {
    if (orientation == null)
      return;
    const orientationNodes = parseExpressions(orientation)[0].terms as [NumberNode, NumberNode, NumberNode];
    const roll = normalizeUnit(orientationNodes[0]).number;
    const pitch = normalizeUnit(orientationNodes[1]).number;
    const yaw = normalizeUnit(orientationNodes[2]).number;
    this.updateMatrixWorld();
  }
}