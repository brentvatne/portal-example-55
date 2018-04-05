import React from 'react';
import { createPortal } from 'react-native/Libraries/Renderer/shims/ReactNative';
import { findNodeHandle, Button, Text, View, StyleSheet } from 'react-native';

const ModalContext = React.createContext(null);

class Modal extends React.Component {
  render() {
    if (this.props.visible) {
      return (
        <ModalContext.Consumer>
          {modalRoot => createPortal(this.props.children, modalRoot)}
        </ModalContext.Consumer>
      );
    }

    return null;
  }
}

export default class App extends React.Component {
  state = {
    modalRoot: null,
  };

  _setModalRoot = view => {
    this.setState({ modalRoot: findNodeHandle(view) });
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {this.state.modalRoot ? (
          <ModalContext.Provider value={this.state.modalRoot}>
            <MyApp />
          </ModalContext.Provider>
        ) : null}

        {/* One tricky thing here, which I didn't implement in this example yet,
            is that we need to set pointerEvents on this depending on whether or
            not we have a modal visible */}
        <View ref={this._setModalRoot} style={StyleSheet.absoluteFill} collapsable={false} />
      </View>
    );
  }
}

class MyApp extends React.Component {
  render() {
    return (
      <React.Fragment>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>From MyApp</Text>
        </View>
        <SomeChild />
      </React.Fragment>
    );
  }
}

class SomeChild extends React.Component {
  state = {
    modalVisible: false,
  };

  // To get around not implementing pointerEvents on container yet
  componentDidMount() {
    setTimeout(() => {
      this.setState({ modalVisible: true });
    }, 1000);

    setTimeout(() => {
      this.setState({ modalVisible: false });
    }, 2000);
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>From SomeChild (child of MyApp)</Text>

        <Modal visible={this.state.modalVisible}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <ModalContext.Consumer>
              {value => (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontSize: 20, color: '#fff' }}>
                    Also from SomeChild (child of MyApp)
                  </Text>
                  <Text style={{ fontSize: 20, color: '#fff' }}>
                    modalHost: {value}
                  </Text>}
                </View>
              )}
            </ModalContext.Consumer>
          </View>
        </Modal>
      </View>
    );
  }
}
