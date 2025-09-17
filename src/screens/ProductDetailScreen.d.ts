import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

declare const ProductDetailScreen: React.FC<{
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
  route: {
    params: {
      product: import('../types').Product;
    };
  };
}>;

export default ProductDetailScreen;
