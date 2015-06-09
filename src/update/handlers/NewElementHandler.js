import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';

import {GRID_SIZE} from '../../components/utils/Constants.js';
import EventTypes from '../EventTypes.js';
import Modes from '../Modes.js';
import handleHover from '../../components/HighlightOnHover.jsx';

/*
 * START ADDING ELEMENT
 */

const StartAddElementAction = function(elemType, coords) {
  this.do = (state) => {
    const startPoint = Vector.fromObject(coords).snap(GRID_SIZE);
    state.addingElement = {
        component: elemType,
        props: {
          id: uuid.v4(),
          connectors: {
            from: startPoint,
            to: startPoint
          }
        },
        startPoint
      };
    return state;
  };
};

const addHandlers = {
  [EventTypes.CanvasMouseDown]: (elemType, coords) => ({
      action: new StartAddElementAction(elemType, coords),
      mode: Modes.addingElement
    })
};

export const handleStartAdd = elemType => event => {
  const handler = addHandlers[event.type];
  return handler ? handler(elemType, event.coords) : null;
};

/*
 * MOVE ELEMENT
 */

const getConnectorPositions = function(component, startPoint, dragPoint) {
  return !component.getConnectorPositions || component.getConnectorPositions(startPoint, dragPoint);
};

const MoveElementAction = function(coords) {
  this.do = (state) => {
    const elem = state.addingElement,
          startPoint = elem.startPoint,
          dragPoint = Vector.fromObject(coords).snap(GRID_SIZE);

    if (dragPoint.equals(startPoint)) {
      return state; // prevent zero size elements
    }
    elem.props.connectors = getConnectorPositions(elem.component, startPoint, dragPoint);
    return state;
  };
};

const addingHandlers = {
  [EventTypes.CanvasMouseMove]: (coords) => ({
    action: new MoveElementAction(coords)
  })
};

export const handleAdding = event => { // TODO make a reusable version of this
  const handler = addingHandlers[event.type];
  return handler ? handler(event.coords) : null;
};

/*
 * FINISH ADDING
 */

const AddElementAction = function() {
  let id;
  this.do = (state) => { // FIXME redo don't work - we need the element in the constructor
    const elem = state.addingElement;
    id = elem.props.id;
    elem.component = handleHover(elem.component);
    state.elements = state.elements.set(id, elem);
    state.addingElement = null;
    return state;
  };
  this.undo = (state) => {
    state.elements.delete(id);
    return state;
  };
};

const finishAddingHandlers = {
  [EventTypes.CanvasMouseUp]: () => ({
    action: new AddElementAction(),
    mode: Modes.default
  })
};

export const handleFinishAdding = event => { // TODO make a reusable version of this
  console.log('handleFinishAdding');
  const handler = finishAddingHandlers[event.type];
  return handler ? handler() : null;
};
