import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { ToastProvider } from "react-native-toast-notifications";
import { TamaguiProvider } from 'tamagui';
import HexSplash from '../components/HexSplash';
import config from '../tamagui.config';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (!loaded) return;

    const timer = setTimeout(() => {
      setAppReady(true);
      SplashScreen.hideAsync();
    }, 1300);

    return () => clearTimeout(timer);
  }, [loaded]);

  if (!loaded || !appReady) {
    return <HexSplash />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <ToastProvider
            duration={2000}
            swipeEnabled
            offsetBottom={50}
            placement='bottom'
            renderToast={({ message }) => (
              <View>
                {typeof message === 'string' ? (
                  <Text style={styles.toastText}>{message}</Text>
                ) : (
                  message
                )}
              </View>
            )}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </ToastProvider>
          <StatusBar style="auto" />
        </ThemeProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  toast: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#333',
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
});
