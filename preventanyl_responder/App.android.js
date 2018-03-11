import React from 'react';
import { AppRegistry, View, StyleSheet } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';

import createStore from './Redux'

// We're going to use navigation with redux
import ReduxNavigation from './src/navigation/DrawerNavigation/ReduxNavigation'
import StatusBarBackground from './src/subcomponents/StatusBarBackground/StatusBarBackground';

// create our store
const store = createStore()


export default class App extends React.Component {
  render() {
    return (
      <Provider store = { store }>
        <View style = { styles.container }>
          { Platform.OS === 'ios' && 
            <StatusBarBackground style = { 
              {
                backgroundColor : '#3498db'
              }
            } />
          }
          <ReduxNavigation />
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})

AppRegistry.registerComponent ('App', () => App);