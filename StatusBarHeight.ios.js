import { NativeModules, StatusBarIOS, Animated } from "react-native";
const { StatusBarManager } = NativeModules;

const value = new Animated.Value(0);

StatusBarManager.getHeight(statusBarFrameData => {
  value.setValue(statusBarFrameData.height);
});

StatusBarIOS.addListener("statusBarFrameDidChange", statusBarData => {
  value.setValue(statusBarData.frame.height);
});

export default value;
