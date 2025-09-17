import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  fetchCategoriesAction,
  fetchProductsAction,
  fetchProductsByCategoryAction,
  searchProductsAction,
} from '../store/actions/productActions';
import {moderateScale, scaleFont} from '../utils/responsive';
import {
  setSearchQuery,
  setSelectedCategory,
} from '../store/slices/productsSlice';
import {useDispatch, useSelector} from 'react-redux';

import type {AppDispatch} from '../store/store';
import FastImage from 'react-native-fast-image';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootState} from '../store/store';
import colors from '../theme/colors';
import debounce from 'lodash.debounce';
import {useNavigation} from '@react-navigation/native';

const ITEM_HEIGHT = 120;
const DEBOUNCE_DELAY = 500;

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

type SectionData = {
  title: string;
  data: (Product | null)[];
};

type Category = {
  name: string;
  slug: string;
  url: string;
};

type RootStackParamList = {
  Home: undefined;
  ProductDetail: {product: Product};
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    allProducts: products = [],
    productsByCategory,
    categories = [],
    loading = false,
    error = null,
    hasMore = false,
    currentPage = 0,
    selectedCategory = null as string | null,
    searchQuery = '',
  } = useSelector((state: RootState) => state.products);

  // Get the correct products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory) {
      return productsByCategory[selectedCategory] || [];
    }
    return products;
  }, [products, productsByCategory, selectedCategory]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const sectionListRef =
    useRef<SectionList<SectionData['data'][number], SectionData>>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchCategoriesAction() as any),
        dispatch(fetchProductsAction({page: 0, refresh: true})),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Handle pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (selectedCategory) {
        // If a category is selected, refresh only that category
        await dispatch(fetchProductsByCategoryAction(selectedCategory) as any);
      } else {
        // If no category is selected, refresh all products
        await dispatch(fetchProductsAction({page: 0, refresh: true}));
      }
      // Always refresh categories to ensure they're up to date
      await dispatch(fetchCategoriesAction() as any);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle search with debounce
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        dispatch(searchProductsAction(query) as any);
      } else {
        dispatch(fetchProductsAction({page: 0, refresh: true}));
      }
    }, DEBOUNCE_DELAY),
    [],
  );

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    dispatch(setSearchQuery(text));

    if (text.trim()) {
      setIsSearching(true);
      debouncedSearch(text);
    } else {
      setIsSearching(false);
      dispatch(fetchProductsAction({page: 0, refresh: true}));
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    // Clear search state
    setSearchText('');
    dispatch(setSearchQuery(''));
    setIsSearching(false);

    // Fetch products for the selected category
    if (category) {
      dispatch(fetchProductsByCategoryAction(category) as any);
    } else {
      // If no category is selected, fetch all products
      dispatch(fetchProductsAction({page: 0, refresh: true}));
    }

    dispatch(setSelectedCategory(category));

    // Scroll to top when category changes
    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: true,
        viewPosition: 0,
      });
    }
  };

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && !isSearching && !selectedCategory) {
      dispatch(fetchProductsAction({page: currentPage + 1, refresh: false}));
    }
  }, [loading, hasMore, isSearching, selectedCategory, currentPage, dispatch]);

  // Prepare sections for SectionList
  const sections = useMemo<SectionData[]>(() => {
    const result: SectionData[] = [];

    if (isSearching || searchQuery) {
      // Show flat list of search results
      result.push({
        title: 'Search Results',
        data: products as (Product | null)[],
      });
    } else if (selectedCategory) {
      // Show only products from the selected category
      const categoryProducts = productsByCategory[selectedCategory] || [];
      result.push({
        title: selectedCategory,
        data: categoryProducts as (Product | null)[],
      });
    } else {
      // Group all products by category
      const productsByCategory = filteredProducts.reduce<
        Record<string, Product[]>
      >((acc: Record<string, Product[]>, product: Product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {});

      Object.entries(productsByCategory).forEach(([category, items]) => {
        result.push({
          title: category,
          data: items as (Product | null)[],
        });
      });
    }

    return result;
  }, [
    filteredProducts,
    selectedCategory,
    isSearching,
    searchQuery,
    productsByCategory,
  ]);

  // Render product item
  const renderProductItem = useCallback(
    ({
      item,
      index,
    }: {
      item: Product | null;
      index: number;
    }): React.ReactElement | null => {
      // Skip rendering if item is null
      if (!item) return null;

      const handleProductPress = () => {
        navigation.navigate('ProductDetail', {product: item});
      };

      return (
        <TouchableOpacity
          style={[
            styles.productItem,
            index === 0 && {borderTopLeftRadius: 0, borderTopRightRadius: 0},
          ]}
          onPress={handleProductPress}>
          <FastImage
            source={{uri: item.thumbnail}}
            style={styles.productImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={1}>
              {item.title} {index}
            </Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Text style={styles.productCategory} numberOfLines={1}>
              {item.category}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.rating} ★</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  // Render section header
  const renderSectionHeader = useCallback(
    ({section}: {section: SectionData}) => {
      if (!section.title) return null;
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>
            {typeof section.title === 'string'
              ? section.title
              : JSON.stringify(section.title)}
          </Text>
        </View>
      );
    },
    [],
  );

  // Render footer with loading indicator
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  // Render empty state
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {loading ? 'Loading...' : 'No products found'}
      </Text>
    </View>
  );

  const getItemLayout = (
    _: SectionListData<Product | null, SectionData>[] | null,
    index: number,
  ) => {
    return {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index};
  };

  // Render the main content
  // State for category dropdown
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Toggle category dropdown
  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  // Handle category selection from dropdown
  const handleCategorySelectFromDropdown = (category: string | null) => {
    handleCategorySelect(category);
    setShowCategoryDropdown(false);
  };

  return (
    <View style={styles.container}>
      {/* Search and Category Row */}
      <View style={styles.searchRow}>
        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={handleSearchChange}
          />
        </View>

        {/* Category Dropdown */}
        <View style={styles.categoryDropdownContainer}>
          <TouchableOpacity
            style={styles.categoryDropdownButton}
            onPress={toggleCategoryDropdown}>
            <Text style={styles.categoryDropdownButtonText} numberOfLines={1}>
              {selectedCategory || 'All'}
            </Text>
          </TouchableOpacity>

          {showCategoryDropdown && (
            <View style={styles.categoryDropdownList}>
              <ScrollView
                style={styles.dropdownScrollView}
                showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.categoryDropdownItem,
                    !selectedCategory && styles.selectedCategoryDropdownItem,
                  ]}
                  onPress={() => handleCategorySelectFromDropdown(null)}>
                  <Text
                    style={[
                      styles.categoryDropdownItemText,
                      !selectedCategory &&
                        styles.selectedCategoryDropdownItemText,
                    ]}>
                    All Categories
                  </Text>
                </TouchableOpacity>

                {categories.map((category: Category, index: number) => {
                  const key = category.slug ?? `category-${index}`;

                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.categoryDropdownItem,
                        selectedCategory === category?.slug &&
                          styles.selectedCategoryDropdownItem,
                      ]}
                      onPress={() =>
                        handleCategorySelectFromDropdown(
                          category?.slug as string,
                        )
                      }>
                      <Text
                        style={[
                          styles.categoryDropdownItemText,
                          selectedCategory === category?.slug &&
                            styles.selectedCategoryDropdownItemText,
                        ]}
                        ellipsizeMode="tail">
                        {category?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* Products */}
      <SectionList
        ref={sectionListRef}
        sections={sections}
        renderItem={renderProductItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => `product-${item?.id || 'null'}-${index}`}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: moderateScale(16),
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    height: moderateScale(40),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    color: colors.text,
    fontSize: scaleFont(14),
  },
  // Search and Category Row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flex: 3,
    marginRight: moderateScale(8),
  },
  categoryDropdownContainer: {
    flex: 1,
    position: 'relative',
  },
  categoryDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),
    height: moderateScale(40),
  },
  categoryDropdownButtonText: {
    color: colors.text,
    fontSize: scaleFont(12),
    marginRight: moderateScale(4),
    flex: 1,
    textTransform: 'capitalize',
  },
  categoryDropdownList: {
    position: 'absolute',
    top: moderateScale(45),
    right: 0,
    // left: 0,
    backgroundColor: colors.surface,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: moderateScale(200),
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: moderateScale(140),
  },
  dropdownScrollView: {
    maxHeight: moderateScale(196),
  },
  categoryDropdownItem: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedCategoryDropdownItem: {
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
  },
  categoryDropdownItemText: {
    color: colors.text,
    fontSize: scaleFont(12),
  },
  selectedCategoryDropdownItemText: {
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
  },
  categoryItem: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    marginRight: moderateScale(8),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryItemSelected: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.text,
    fontSize: scaleFont(12),
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  selectedCategoryItem: {
    backgroundColor: colors.primary,
  },
  selectedCategoryText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  productsList: {
    padding: moderateScale(16),
    marginBottom: moderateScale(120),
  },
  sectionList: {
    flexGrow: 1,
    paddingBottom: moderateScale(16),
  },
  sectionHeader: {
    padding: moderateScale(16),
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: moderateScale(10),
    borderTopLeftRadius: moderateScale(8),
    borderTopRightRadius: moderateScale(8),
  },
  sectionHeaderText: {
    color: colors.primary,
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  productItem: {
    flexDirection: 'row',
    padding: moderateScale(16),
    backgroundColor: colors.surface,
    marginBottom: moderateScale(2),
    borderRadius: moderateScale(8),
  },
  productImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(16),
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    color: colors.text,
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    color: colors.primary,
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCategory: {
    color: colors.textSecondary,
    fontSize: scaleFont(12),
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFD700',
    fontSize: scaleFont(14),
    marginLeft: moderateScale(4),
  },
  loadingContainer: {
    padding: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(40),
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: scaleFont(16),
    textAlign: 'center',
  },
});

export default HomeScreen;
