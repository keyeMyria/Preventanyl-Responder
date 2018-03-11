import React from 'react';
import { AppRegistry, Platform, View, StyleSheet } from 'react-native';

import TabNavigation from './src/navigation/TabNavigation/TabNavigation';
import StatusBarBackground from './src/subcomponents/StatusBarBackground/StatusBarBackground';

export default class App extends React.Component {
  render() {
    return (
      <View style = { styles.container }>
          { Platform.OS === 'ios' && 
            <StatusBarBackground style = { 
              {
                backgroundColor : '#3498db'
              }
            } />
          }
          <TabNavigation />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})

AppRegistry.registerComponent ('App', () => App);