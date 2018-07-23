import React, { forwardRef } from "react";
import { ScrollView, View } from "react-native";

const ClippyScrollView = forwardRef((props, innerRef) => (
  <ScrollView {...props} innerRef={innerRef} />
));

ClippyScrollView.StatusBarOffset = StatusBarValue;

ClippyScrollView.Mask = props => <View {...props} />;

export default ClippyScrollView;
