import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import colors from '../../../theme/colors';

const FeedScreen = () => {
  const user = useSelector((state) => state.user.info);

  const config = {
    title: 'Feed Screen',
    rightIcon: <Ionicons name="search" size={24} color={colors.text} />,
    rightIcon2: <Ionicons name="notifications" size={24} color={colors.text} />,
    rightIcon3: <Ionicons name="menu" size={24} color={colors.text} />,
    onRightPress: () => console.log('Search pressed'),
    onRightPress2: () => console.log('Notifications pressed'),
    onRightPress3: () => console.log('Menu pressed'),
  };

  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({});
