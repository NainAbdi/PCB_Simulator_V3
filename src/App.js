import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Style } from 'radium';

import Sidebar from './ui/sidebar/Sidebar.js';
import CircuitDiagram from './CircuitDiagram.js';

import { componentSelectorButtonClicked } from './redux/actions.js';

const App = props => {
  const {
    styles,
    theme,
    getCanvasSize,
    componentSelectorButtonClicked: onButtonClicked
  } = props;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row'
    }}>
      <Style
        rules={ styles.global }
      />
      <Sidebar
        theme={ theme } // TODO put theme in context? or is this a silly idea?
        style={ styles.side }
        onButtonClicked={ onButtonClicked } />
      <CircuitDiagram
        theme={ theme }
        getDimensions={ getCanvasSize } />
    </div>
  );
};

App.propTypes = {
  styles: PropTypes.shape({
    global: PropTypes.object,
    side: PropTypes.object
  }).isRequired,
  theme: PropTypes.object.isRequired,
  getCanvasSize: PropTypes.func.isRequired,

  /* Injected by redux */
  // state
  // ...

  // action creators
  componentSelectorButtonClicked: PropTypes.func.isRequired
};

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps(/*state*/) {
  return {};
}

const mapDispatchToProps = {
  componentSelectorButtonClicked
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
