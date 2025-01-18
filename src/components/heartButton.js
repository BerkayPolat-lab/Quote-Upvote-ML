import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const HeartButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.heartButton} onPress={onPress}>
      <Icon name="heart" size={30} color="red" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  heartButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default HeartButton;