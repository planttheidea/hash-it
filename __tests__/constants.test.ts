import { describe, expect, it } from 'vitest';
import { XML_ELEMENT_REGEXP } from '../src/constants.js';

describe('XML_ELEMENT_REGEXP', () => {
  it('should match HTML element class strings', () => {
    const match = '[object HTMLDivElement]'.match(XML_ELEMENT_REGEXP);

    expect(match?.[1]).toBe('HTMLDivElement');
  });

  it('should match SVG element class strings', () => {
    const match = '[object SVGCircleElement]'.match(XML_ELEMENT_REGEXP);

    expect(match?.[1]).toBe('SVGCircleElement');
  });

  it('should match MathML element class strings', () => {
    const match = '[object MathMLElement]'.match(XML_ELEMENT_REGEXP);

    expect(match?.[1]).toBe('MathMLElement');
  });

  it('should not match element-like class strings that are not HTML, SVG, or MathML', () => {
    expect('[object TestElement]'.match(XML_ELEMENT_REGEXP)).toBeNull();
    expect('[object Element]'.match(XML_ELEMENT_REGEXP)).toBeNull();
  });
});
