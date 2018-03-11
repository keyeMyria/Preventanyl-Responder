import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Text, View, Image, StyleSheet } from 'react-native';

import MapComponent from '../../components/MapComponent/MapComponent'
import ProfileComponent from '../../components/ProfileComponent/ProfileComponent'
import LoginComponent from '../../components/LoginComponent/LoginComponent'
import RegisterKitComponent from '../../components/RegisterKitComponent/RegisterKitComponent'
import SupportUsComponent from '../../components/Support Us/SupportUsComponent';

const TabNavigation = TabNavigator ({
  Map : {
    screen : MapComponent,
    navigationOptions : {
      tabBarLabel : 'Home',
      tabBarIcon  : ({ tintColor }) => (
        <Image 
          source = { require ('../../../assets/map.imageset/map.png') }
          style  = { [styles.icon, { tintColor : tintColor }]}
        />
      )
    },
  },
  Profile : {
    screen : LoginComponent,
    navigationOptions : {
      tabBarLabel : 'Profile',
      tabBarIcon  : ({ tintColor }) => (
        <Image 
          source = { require ('../../../assets/profile.imageset/user_male.png') }
          style  = { [styles.icon, { tintColor : tintColor }]}
        />
      )
    },
  },
  Register : {
    screen : RegisterKitComponent,
    navigationOptions : {
      tabBarLabel : 'RegisterKit',
      tabBarIcon  : (
        { 
          tintColor 
        }
        ) => (
        <Image 
          source = { require ('../../../assets/address-book.imageset/address_book.png') }
          style  = { [styles.icon, { tintColor : tintColor }]}
        />
      )
    },
  },
  SupportUs : {
    screen : SupportUsComponent,
    navigationOptions : {
      tabBarLabel : 'Support Us',
      tabBarIcon  : (
        { 
          tintColor 
        }
        ) => (
        <Image 
          source = { require ('../../../assets/address-book.imageset/address_book.png') }
          style  = { [styles.icon, { tintColor : tintColor }]}
        />
      )
    },
  }
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

export default TabNavigation;