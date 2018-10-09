# Clippy Scroll View

In iOS, you sometimes have a white status bar, and scroll view with a background, and white text. When you scroll, the white text can go under the status bar, and look generally terrible.

In the Weather app, they scroll the background, but the text clips right before the status bar.

![Status bar clipping content](https://i.stack.imgur.com/3UBmQ.png)

This is a React Native implementation of this.

```jsx
import ClippyScrollView from "clippy-scroll-view";

export default () => (
  <ClippyScrollView>
    <Text>I do not get clipped by the status bar</Text>
    <ClippyScrollView.Mask>
      <Text>I DO get clipped by the status bar</Text>
    </ClippyScrollView.Mask>
  </ClippyScrollView>
);
```

Pass in regular scroll view props to `<ClippyScrollView>`.

If you want to customise where it gets clipped, you can pass in `topOffset` to the `<ClippyScrollView>` component. This can be a `number`, or an `Animated.Value`.

We also expose an `Animated.Value` of the status bar's current height as the named export `StatusBarHeight`.

This works on Android too, `ClippyScrollView` is cust a regular scroll view, `Mask` is just a view.
