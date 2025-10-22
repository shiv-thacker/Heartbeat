import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import colors from '../../../theme/colors';
import MenuScreen from './MenuScreen';

const FeedScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.info);
  const [showMenu, setShowMenu] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));

  const openMenu = () => {
    setShowMenu(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const config = {
    title: 'Feed Screen',
    rightIcon: <Ionicons name="notifications" size={24} color={colors.borderDark} />,
    rightIcon2: <Ionicons name="search" size={24} color={colors.borderDark} />,
    rightIcon3: <Ionicons name="menu" size={24} color={colors.borderDark} />,
    onRightPress: () => console.log('Search pressed'),
    onRightPress2: () => console.log('Notifications pressed'),
    onRightPress3: openMenu,
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title={config.title}
        rightIcon={config.rightIcon}
        rightIcon2={config.rightIcon2}
        rightIcon3={config.rightIcon3}
        onRightPress={config.onRightPress}
        onRightPress2={config.onRightPress2}
        onRightPress3={config.onRightPress3}
        user={user}
      />
      <Text>FeedScreen</Text>

      {/* Menu Overlay */}
      {showMenu && (
        <MenuScreen navigation={navigation} slideAnim={slideAnim} setShowMenu={setShowMenu} />
      )}
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
