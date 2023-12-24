import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
import SplashImg from '../../assets/splash.png';

const Splash = ({ navigation }) => {
  const fadeIn = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeIn, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          navigation.replace('register');
        });
      }, 2000);
    });
  }, []);

  const animatedStyle = {
    opacity: fadeIn,
  };

  return (
    <View style={styles.splash}>
      <Animated.Image
        source={SplashImg}
        style={[styles.logo, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  splash: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default Splash;
