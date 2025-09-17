import {
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale, scaleFont} from '../utils/responsive';

import FastImage from 'react-native-fast-image';
import React from 'react';
import {RootStackParamList} from '../types';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import colors from '../theme/colors';

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetail'
>;
type ProductDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductDetail'
>;

interface ProductDetailScreenProps {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const IMAGE_SIZE = SCREEN_WIDTH - 32;

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({route}) => {
  const {product} = route.params;
  const [selectedImage, setSelectedImage] = React.useState(product.images[0]);

  // Format price with discount
  const formatPrice = (price: number, discount: number) => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount) / 100;
      return (
        <View style={styles.priceContainer}>
          <Text style={styles.discountedPrice}>
            ${discountedPrice.toFixed(2)}
          </Text>
          <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
          <Text style={styles.discountBadge}>{discount}% OFF</Text>
        </View>
      );
    }
    return <Text style={styles.price}>${price.toFixed(2)}</Text>;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Images Carousel */}
        <View style={styles.imageContainer}>
          <FastImage
            source={{uri: selectedImage}}
            style={styles.mainImage}
            resizeMode={FastImage.resizeMode.contain}
          />

          {/* Thumbnails */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsContainer}>
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(image)}
                style={[
                  styles.thumbnailContainer,
                  selectedImage === image && styles.selectedThumbnail,
                ]}>
                <FastImage
                  source={{uri: image}}
                  style={styles.thumbnail}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.title}>{product.title}</Text>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{product.rating} ★</Text>
              </View>
              <Text style={styles.reviews}>
                ({Math.floor(Math.random() * 1000)} reviews)
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            {formatPrice(product.price, product.discountPercentage)}
            <Text style={styles.stockText}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specsContainer}>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Brand</Text>
                <Text style={styles.specValue}>{product.brand}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Category</Text>
                <Text style={[styles.specValue, {textTransform: 'capitalize'}]}>
                  {product.category}
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Stock</Text>
                <Text
                  style={[
                    styles.specValue,
                    {color: product.stock > 0 ? '#4CAF50' : '#F44336'},
                  ]}>
                  {product.stock} units available
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart / Buy Now */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: moderateScale(80), // Space for the footer
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(16),
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: moderateScale(8),
  },
  shareButton: {
    padding: moderateScale(8),
  },
  imageContainer: {
    backgroundColor: colors.surface,
    paddingBottom: moderateScale(16),
    marginBottom: moderateScale(8),
  },
  mainImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    alignSelf: 'center',
  },
  thumbnailsContainer: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(8),
  },
  thumbnailContainer: {
    marginRight: moderateScale(8),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: 'transparent',
    padding: moderateScale(2),
  },
  selectedThumbnail: {
    borderColor: colors.primary,
  },
  thumbnail: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(6),
  },
  infoContainer: {
    padding: moderateScale(16),
  },
  titleContainer: {
    marginBottom: moderateScale(16),
  },
  brand: {
    color: colors.primary,
    fontSize: scaleFont(14),
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: scaleFont(22),
    fontWeight: 'bold',
    marginBottom: moderateScale(8),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(4),
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(8),
  },
  ratingText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: scaleFont(14),
  },
  reviews: {
    color: colors.textSecondary,
    fontSize: scaleFont(12),
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(16),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: moderateScale(16),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: colors.primary,
    fontSize: scaleFont(24),
    fontWeight: 'bold',
  },
  discountedPrice: {
    color: colors.primary,
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    marginRight: moderateScale(8),
  },
  originalPrice: {
    color: colors.textSecondary,
    fontSize: scaleFont(16),
    textDecorationLine: 'line-through',
    marginRight: moderateScale(8),
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(4),
    fontSize: scaleFont(12),
    fontWeight: 'bold',
  },
  stockText: {
    color: colors.textSecondary,
    fontSize: scaleFont(14),
  },
  section: {
    marginBottom: moderateScale(24),
  },
  sectionTitle: {
    color: colors.text,
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    marginBottom: moderateScale(12),
  },
  description: {
    color: colors.textSecondary,
    fontSize: scaleFont(14),
    lineHeight: moderateScale(22),
  },
  specsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(8),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  specLabel: {
    color: colors.textSecondary,
    fontSize: scaleFont(14),
    flex: 1,
  },
  specValue: {
    color: colors.text,
    fontSize: scaleFont(14),
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: moderateScale(16),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(8),
  },
  addToCartText: {
    color: colors.primary,
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginLeft: moderateScale(8),
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    color: colors.onPrimary,
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
