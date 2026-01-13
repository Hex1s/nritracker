import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ToastProvider } from "react-native-toast-notifications";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, Text, View } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
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
