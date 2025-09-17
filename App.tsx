import {ActivityIndicator, LogBox, StatusBar, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
// Import store and persistor
import {persistor, store} from './src/store/store';

import {Alert} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
// Import screens
import HomeScreen from './src/screens/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {PersistGate} from 'redux-persist/integration/react';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// Import theme
import colors from './src/theme/colors';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';

// Enable screens for better performance
enableScreens();

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
]);

// Create stack navigator
const Stack = createNativeStackNavigator();

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
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <PersistGate
            loading={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.background,
                }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{marginTop: 10, color: colors.onBackground}}>
                  Loading your data...
                </Text>
              </View>
            }
            persistor={persistor}
            onBeforeLift={() => {
              // This runs after rehydration is complete
              console.log('Redux store rehydrated');
            }}>
            <SafeAreaProvider>
              <NavigationContainer>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor={colors.background}
                />
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
                      title: 'Products',
                    }}
                  />
                  <Stack.Screen
                    name="ProductDetail"
                    component={ProductDetailScreen}
                    options={{
                      title: '',
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;
