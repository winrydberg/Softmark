import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
import {ScrollView} from 'react-native-gesture-handler';

export default (props) => {
  const [webViewHeight, setWebViewHeight] = useState(null);

  const onWebViewMessage = (event) => {
    setWebViewHeight(Number(event.nativeEvent.data));
  };

  return (
    <ScrollView>
      <WebView
        onMessage={onWebViewMessage}
        injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
        //   source={{html: props.html}}
        source={{
          html:
            `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                          body { font-size: 80%; word-wrap: break-word; overflow-wrap: break-word; color: gray }
                      </style>
                        </head><body>` +
            props.html +
            `</body></html>`,
        }}
        style={{
          width: Dimensions.get('window').width,
          height: webViewHeight,
        }}
      />
    </ScrollView>
  );
};
