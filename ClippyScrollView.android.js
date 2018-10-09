import React, { forwardRef } from "react";
import { ScrollView, View } from "react-native";

const ClippyScrollView = forwardRef((props, innerRef) => (
  <ScrollView {...props} ref={innerRef} />
));

ClippyScrollView.StatusBarOffset = StatusBarValue;

ClippyScrollView.Mask = View;

export default ClippyScrollView;
