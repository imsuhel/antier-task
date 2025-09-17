import {ActivityIndicator, LogBox, StatusBar, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import {Alert} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import HomeScreen from './src/screens/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import {Provider} from 'react-redux';
import {RootStackParamList} from './src/types';
import colors from './src/theme/colors';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {store} from './src/store/store';

// Enable screens for better performance
enableScreens();

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
]);

// Create stack navigator with proper typing
const Stack = createNativeStackNavigator<RootStackParamList>();

// Error boundary component
class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {hasError: boolean}
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error: Error) {
    console.error('App Error Boundary caught an error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
          }}>
          <Text style={{color: colors.error, fontSize: 18, marginBottom: 20}}>
            Something went wrong
          </Text>
          <Text
            style={{
              color: colors.onBackground,
              textAlign: 'center',
              paddingHorizontal: 20,
            }}>
            The app encountered an error. Please restart the application.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize any app-wide setup here
    const initializeApp = async () => {
      try {
        // Add any async initialization here
        setIsReady(true);
      } catch (err) {
        console.error('App initialization error:', err);
        setError('Failed to initialize the app. Please try again.');
        setIsReady(true); // Still set ready to show error UI
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
          padding: 20,
        }}>
        <Text
          style={{
            color: colors.error,
            fontSize: 18,
            marginBottom: 20,
            textAlign: 'center',
          }}>
          {error}
        </Text>
        <Text style={{color: colors.onBackground, textAlign: 'center'}}>
          Please try again or restart the application.
        </Text>
        <Text
          style={{
            color: colors.onBackground,
            textAlign: 'center',
            marginTop: 20,
          }}
          onPress={() => Alert.alert('Error', error)}>
          View error details
        </Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider>
          <GestureHandlerRootView
            style={{flex: 1, backgroundColor: colors.background}}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.background}
            />
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerStyle: {
                    backgroundColor: colors.surface,
                  },
                  headerTintColor: colors.onSurface,
                  headerTitleStyle: {
                    color: colors.onSurface,
                  },
                  contentStyle: {
                    backgroundColor: colors.background,
                  },
                }}>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    title: 'Home',
                  }}
                />
                <Stack.Screen
                  name="ProductDetail"
                  component={ProductDetailScreen}
                  options={{
                    title: 'Product Details',
                    headerBackTitleVisible: false,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
