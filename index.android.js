/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
/*引入*/
import MainView from "./app/login";
AppRegistry.registerComponent('myproject', () => MainView);
