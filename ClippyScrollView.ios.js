import React, { Component, createContext, forwardRef } from "react";
import {
  ScrollView,
  View,
  Text,
  MaskedViewIOS,
  Animated,
  UIManager,
  findNodeHandle
} from "react-native";
import StatusBarHeight from "./StatusBarHeight";

const ScrollViewContext = createContext(null);

class ClippyScrollViewBase extends Component {
  static defaultProps = {
    topOffset: StatusBarHeight // number or Animated.Value
  };

  constructor({ topOffset }) {
    super();
    this.scrollTop = new Animated.Value(0);

    this.scrollViewContext = {
      current: null,
      topScrollGuide: Animated.add(this.scrollTop, topOffset)
    };
    this.scrollAnimatedValueAttachment = null;
  }

  componentDidMount() {
    this.attachScrollEvent();
  }

  componentDidUpdate(prevProps) {
    this.attachScrollEvent();
  }

  setScrollView = e => {
    this.scrollViewContext.current = e;
    if (this.props.innerRef != null) {
      this.props.innerRef(e);
    }
  };

  attachScrollEvent = () => {
    if (this.scrollAnimatedValueAttachment) {
      this.scrollAnimatedValueAttachment.detach();
    }
    this.scrollAnimatedValueAttachment = Animated.attachNativeEvent(
      this.scrollViewContext.current,
      "onScroll",
      [{ nativeEvent: { contentOffset: { y: this.scrollTop } } }]
    );
  };

  render() {
    const { innerRef, ...props } = this.props;
    return (
      <ScrollViewContext.Provider value={this.scrollViewContext}>
        <ScrollView
          {...props}
          ref={this.setScrollView}
          scrollEventThrottle={1}
        />
      </ScrollViewContext.Provider>
    );
  }
}

class MaskBase extends Component {
  state = { y: 0, height: 0 };

  maskView = React.createRef();

  componentDidMount() {
    setImmediate(() => {
      this.setLayoutIfNeeded();
    });
  }

  componentDidUpdate() {
    this.setLayoutIfNeeded();
  }

  setLayoutIfNeeded() {
    UIManager.measureLayout(
      findNodeHandle(this.maskView.current),
      findNodeHandle(this.props.scrollViewContext.current),
      () => {},
      (x, y, width, height) => {
        this.setState(
          s => (s.y !== y || s.height !== height ? { y, height } : null)
        );
      }
    );
  }

  render() {
    const { y, height } = this.state;
    const top = this.props.scrollViewContext.topScrollGuide.interpolate({
      inputRange: [y, y + height],
      outputRange: [0, height],
      extrapolate: "clamp"
    });

    const maskElement = (
      <Animated.View
        style={{
          position: "absolute",
          backgroundColor: "black",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          transform: [{ translateY: top }]
        }}
      />
    );

    return (
      <MaskedViewIOS ref={this.maskView} maskElement={maskElement}>
        {this.props.children}
      </MaskedViewIOS>
    );
  }
}

const ClippyScrollView = forwardRef((props, innerRef) => (
  <ClippyScrollViewBase {...props} innerRef={innerRef} />
));

ClippyScrollView.StatusBarHeight = StatusBarHeight;

ClippyScrollView.Mask = props => (
  <ScrollViewContext.Consumer>
    {scrollViewContext => (
      <MaskBase {...props} scrollViewContext={scrollViewContext} />
    )}
  </ScrollViewContext.Consumer>
);

export default ClippyScrollView;
