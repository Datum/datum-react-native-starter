# React-Native Setup

These steps are only applicable if you are using react-native build tool.
We are currently **only supporting the official react-native build tool**

**As of now, we are not supporting Expo (Expo is not compatible with the datum-sdk)**

**Also not supporting `yarn` since `rn-nodeify` uses `npm`**

## Quick Start
1. clone this repo
2. execute `npm install`
3. link libraries by executing `react-native link`
4. run your app
> For Android: react-native run-android

> For IOS : react-native run-ios

## General SDK Setup Instructions
**_This setup is done with following:_**
- Node.js  Version: 10.8.0
- npm  Version: 6.2.0
- react-native Version: 0.57.0
- react Version: 16.5.0

1. If you don't have an active project yet, create your `react-native` project using [react-native-cli](https://www.npmjs.com/package/react-native-cli).
```
react-native init datum-qs
cd datum-qs
```

2. Make sure your react-native project can run before proceeding.

3. Install the `datum-sdk`
```bash
npm i --save datum-sdk  
```

4. Install additional dependencies
```bash
npm i --save react-native-crypto react-native-randombytes
npm i --save-dev tradle/rn-nodeify
# install node core shims and recursively hack package.json files
# in ./node_modules to add/update the "browser"/"react-native" field with relevant mappings
./node_modules/.bin/rn-nodeify --hack --install
```

For more info, please refer to [this](https://www.npmjs.com/package/react-native-crypto)

5. Create global.js file on your project_root that has the following
```javascript
/* eslint disable */
global.Buffer = require('buffer').Buffer;
global.process = require('process');

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}
if(typeof self ==='undefined'){
  global.self = global;
}
```

6. Uncomment the `require('crypto')` on `shim.js` to ensure the sdk has a crypto object

7. Include the following in your project_root/index.js [ or your entry point ]
```javascript
/* eslint disable */
import './global';
import './shim';
```

8. Link the libraries
```bash
react-native link
```

8. Start your project
> For Android: react-native run-android

> For IOS : react-native run-ios

## Known Issues

### When using react-native `0.55.2` and react `16.3.1`
you may encounter
```
error: bundling failed: Error: Couldn't find preset "es2015-node5" relative to directory
```
and
```
error: bundling failed: Error: Couldn't find preset "stage-2" relative to directory
```
you just need to install them by doing:
```
npm install --save-dev babel-preset-es2015-node5 babel-preset-stage-2
```

### When running android, you may encounter this error:
```
Objects are not valid as a React child (found: object with keys {$$typeof, type, key, ref, props, _owner, _store}). If you meant to render a collection of children, use an array instead.
```
to solve this, just require the `datum-sdk` on the index.js

### Running older versions of android:
_If you faced the following error when:_
```bash
> A problem occurred configuring project ':react-native-randombytes'.
     > The SDK Build Tools revision (23.0.1) is too low for project ':react-native-randombytes'.
      Minimum required is 25.0.0
```
 You will need to add the following in your project_root/android/build.gradle file after dependencies
```gradle
{

dependencies{
  ...
}  
subprojects {
  project.configurations.all {
      afterEvaluate {project ->
        if (project.hasProperty("android")) {
            android {
                compileSdkVersion 26
                buildToolsVersion '26.0.2'
            }
        }
    }
     resolutionStrategy.eachDependency { details ->
        if (details.requested.group == 'com.android.support'
              && !details.requested.name.contains('multidex') ) {
           details.useVersion "26.0.2"
        }
     }
  }}
}
```

### Commonly encountered react-native errors
These resources may help with resolving some issues.
- `config.h` not found: https://github.com/facebook/react-native/issues/14382
- `libfishook.a` not found: https://github.com/facebook/react-native/issues/19569


## Example


##### index.js

_Assuming that index.js is your project entry point_

```javascript
/** @format */
import './global';
import './shim';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

```


##### App.js

_Assuming that App.js is where you have your root element_

```javascript
import React, {Component} from 'react';
import {View,Text} from 'react-native';


class App extends Component{
  constructor(props){
    super(props);
    this.Datum = require('datum-sdk');
    this.state={};
  }
  componentDidMount(){
    this.Datum.createIdentity("password")
    .then(id=>this.setState({key:id.keystore}))
    .catch(err=>this.setState({error:JSON.stringify(err)}));
  }
  render() {
    return (
      <View>
        <Text>Welcome to Datum</Text>
        <Text>{this.state.key}</Text>
        <Text>{this.state.error}</Text>
      </View>

    );
  }
}

export default App;
```
