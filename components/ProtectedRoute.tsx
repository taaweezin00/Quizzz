import { useAuth } from '@/contexts/AuthContext';
import { Redirect, usePathname } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  // ถ้ากำลังโหลด แสดง loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>Checking authentication...</Text>
      </View>
    );
  }

  // ถ้าไม่มี user และไม่ใช่หน้า login ให้ redirect ไปหน้า login
  if (!user && pathname !== '/') {
    console.log('🔐 No user found, redirecting to login...');
    return <Redirect href="/" />;
  }

  // ถ้าไม่มี user และอยู่หน้า login ให้แสดง children (หน้า login)
  if (!user && pathname === '/') {
    return <>{children}</>;
  }

  // ถ้ามี user และอยู่หน้า login ให้ redirect ไปหน้า members
  if (user && pathname === '/') {
    console.log('✅ User found, redirecting to members...');
    return <Redirect href="/(tabs)/members" />;
  }

  // ถ้ามี user และไม่ใช่หน้า login ให้แสดง children
  return <>{children}</>;
}