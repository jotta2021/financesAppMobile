import { View, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function ComponenttextInput({ placeholder, children,visible,value,onChangeText }) {
  function Focused() {
    setIsFocused(true);
  }

  function Blur() {
    setIsFocused(false);
  }

  const [isfocused, setIsFocused] = useState(false);

  return (
    <View>
      <TextInput
        style={isfocused ? styles.containerInputFocus : styles.containerInput}
        onFocus={Focused}
        onBlur={Blur}
        placeholder={placeholder}
        children={children}
        secureTextEntry={visible? true : false}
        value={value}
        onChangeText={onChangeText}
      
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerInput: {
    
    width: 350,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderBottomWidth:1,
    paddingLeft:10
  
  },
  containerInputFocus: {
    
    borderColor: '#009688',
    width: 350,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth:2,
    paddingLeft:10
  },
});
