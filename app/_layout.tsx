import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ProtectedRoute>
    </AuthProvider>
  );
}