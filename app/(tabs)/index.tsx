import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import axios from 'axios';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// api config
const API_CONFIG = {
  baseURL: 'https://cis.kku.ac.th/api',
  apiKey: '60f7fd4260c2855245635ef4efaccc902fe6eb1fd20b055c099a2fb73cc03c2b',
};

export default function LoginScreen() {
  const { isPhone, isTablet, isDesktop, responsiveFontSize, responsiveSpacing } = useResponsive();
  const { login, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('thaweesin.j@kkumail.com');
  const [password, setPassword] = useState('XXXXXXXXXXXX');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Attempting login with:', { email, password: '***' });

      // เรียก API Loign
      const response = await axios.post(
        `${API_CONFIG.baseURL}/classroom/signin`,
        {
          email,
          password
        },
        {
          headers: {
            'accept': 'application/json',
            'x-api-key': API_CONFIG.apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log('Login response:', response.data);

      if (response.data && response.data.data && response.data.data.token) {
        const userData = response.data.data;
        
        // Auth Context  login
        await login({
          _id: userData._id,
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          token: userData.token,
          education: userData.education
        });
        
        console.log('Login successful, redirecting to members...');
        
        //router.replace('/(tabs)/members');
        
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error: any) {
      console.error('Login error details:', error.response?.data || error.message);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    loginContainer: {
      marginHorizontal: responsiveSpacing(20),
      padding: responsiveSpacing(20),
      backgroundColor: 'white',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    loginContainerDesktop: {
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
      marginHorizontal: 'auto',
      padding: responsiveSpacing(40),
    },
    loginContainerTablet: {
      maxWidth: 500,
      alignSelf: 'center',
      padding: responsiveSpacing(30),
    },
    title: {
      fontSize: responsiveFontSize(24),
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: responsiveSpacing(30),
      color: '#333',
    },
    titleDesktop: {
      fontSize: responsiveFontSize(32),
      marginBottom: responsiveSpacing(40),
    },
    titleTablet: {
      fontSize: responsiveFontSize(28),
      marginBottom: responsiveSpacing(35),
    },
    inputContainer: {
      marginBottom: responsiveSpacing(20),
    },
    input: {
      backgroundColor: '#f8f8f8',
      padding: responsiveSpacing(15),
      borderRadius: 8,
      marginBottom: responsiveSpacing(15),
      borderWidth: 1,
      borderColor: '#e0e0e0',
      fontSize: responsiveFontSize(16),
    },
    inputDesktop: {
      padding: responsiveSpacing(20),
      fontSize: responsiveFontSize(16),
      marginBottom: responsiveSpacing(20),
    },
    inputTablet: {
      padding: responsiveSpacing(18),
      fontSize: responsiveFontSize(16),
      marginBottom: responsiveSpacing(18),
    },
    button: {
      backgroundColor: '#007AFF',
      padding: responsiveSpacing(15),
      borderRadius: 8,
      alignItems: 'center',
      opacity: loading ? 0.6 : 1,
    },
    buttonDesktop: {
      padding: responsiveSpacing(20),
    },
    buttonTablet: {
      padding: responsiveSpacing(18),
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: responsiveFontSize(16),
    },
    buttonTextDesktop: {
      fontSize: responsiveFontSize(18),
    },
    loadingText: {
      textAlign: 'center',
      marginTop: responsiveSpacing(10),
      color: '#666',
      fontSize: responsiveFontSize(14),
    },
    debugInfo: {
      marginTop: responsiveSpacing(20),
      padding: responsiveSpacing(10),
      backgroundColor: '#fff3cd',
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#ffc107',
    },
    debugText: {
      fontSize: responsiveFontSize(12),
      color: '#856404',
    },
  });

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[
          styles.loginContainer,
          isDesktop && styles.loginContainerDesktop,
          isTablet && styles.loginContainerTablet
        ]}>
          <Text style={[
            styles.title,
            isDesktop && styles.titleDesktop,
            isTablet && styles.titleTablet
          ]}>
            KKU Social App
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                isDesktop && styles.inputDesktop,
                isTablet && styles.inputTablet
              ]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
            <TextInput
              style={[
                styles.input,
                isDesktop && styles.inputDesktop,
                isTablet && styles.inputTablet
              ]}
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.button,
              isDesktop && styles.buttonDesktop,
              isTablet && styles.buttonTablet
            ]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={[
                styles.buttonText,
                isDesktop && styles.buttonTextDesktop
              ]}>
                Login
              </Text>
            )}
          </TouchableOpacity>

          {loading && (
            <Text style={styles.loadingText}>กำลังเข้าสู่ระบบ...</Text>
          )}

          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              🔐 Login required to access Members
            </Text>
            <Text style={styles.debugText}>
              📧 Email: {email}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}