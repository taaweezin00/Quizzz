import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useResponsive } from '@/hooks/useResponsive';

type UserData = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  type: string;
  education: {
    major: string;
    enrollmentYear: string;
    studentId: string;
  };
  token: string;
};

export default function ProfileScreen() {
  const { isPhone, isTablet, isDesktop, responsiveFontSize, responsiveSpacing } = useResponsive();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data.data || data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/');
          }
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
      flexGrow: 1,
      padding: responsiveSpacing(16),
    },
    profileCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: responsiveSpacing(20),
      marginBottom: responsiveSpacing(16),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: responsiveSpacing(20),
    },
    avatar: {
      width: responsiveSpacing(80),
      height: responsiveSpacing(80),
      borderRadius: responsiveSpacing(40),
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: responsiveSpacing(16),
    },
    avatarText: {
      color: 'white',
      fontSize: responsiveFontSize(32),
      fontWeight: 'bold',
    },
    userName: {
      fontSize: responsiveFontSize(24),
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    userEmail: {
      fontSize: responsiveFontSize(16),
      color: '#666',
      textAlign: 'center',
      marginTop: responsiveSpacing(4),
    },
    infoSection: {
      marginBottom: responsiveSpacing(20),
    },
    sectionTitle: {
      fontSize: responsiveFontSize(18),
      fontWeight: 'bold',
      color: '#333',
      marginBottom: responsiveSpacing(12),
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: responsiveSpacing(8),
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
      fontSize: responsiveFontSize(14),
      color: '#666',
      fontWeight: '500',
    },
    infoValue: {
      fontSize: responsiveFontSize(14),
      color: '#333',
      textAlign: 'right',
      flex: 1,
      marginLeft: responsiveSpacing(10),
    },
    logoutButton: {
      backgroundColor: '#FF3B30',
      padding: responsiveSpacing(16),
      borderRadius: 8,
      alignItems: 'center',
      marginTop: responsiveSpacing(20),
    },
    logoutButtonText: {
      color: 'white',
      fontSize: responsiveFontSize(16),
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: responsiveFontSize(16),
      color: '#666',
      marginTop: responsiveSpacing(10),
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No user data found</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={{ color: '#007AFF', marginTop: 10 }}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.firstname?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {userData.firstname} {userData.lastname}
          </Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Academic Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student ID</Text>
            <Text style={styles.infoValue}>
              {userData.education?.studentId || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Major</Text>
            <Text style={styles.infoValue}>
              {userData.education?.major || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Year</Text>
            <Text style={styles.infoValue}>
              {userData.education?.enrollmentYear || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{userData.role}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{userData.type}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}