import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { ToastProvider } from "react-native-toast-notifications";
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';

// Предотвращаем автоматическое скрытие SplashScreen
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ToastProvider duration={2000} swipeEnabled offsetBottom={50} placement='bottom' renderToast={({ message, type }) => (
          <View>
            {typeof message === 'string' ? (
              <Text style={styles.toastText}>
                {message}
              </Text>
            ) : (
              message
            )}
          </View>
        )}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        </ToastProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TamaguiProvider>
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
