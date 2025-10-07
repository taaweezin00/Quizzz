import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// API Configuration
const API_CONFIG = {
  baseURL: 'https://cis.kku.ac.th/api',
  apiKey: '60f7fd4260c2855245635ef4efaccc902fe6eb1fd20b055c099a2fb73cc03c2b',
};

type Member = {
  _id: string;
  studentId: string;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  faculty?: string;
  department?: string;
  major?: string;
};

export default function MembersScreen() {
  const { user, logout } = useAuth();
  const { isPhone, isTablet, isDesktop, responsiveFontSize, responsiveSpacing } = useResponsive();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedYear, setSelectedYear] = useState('2565');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const years = ['2565', '2564', '2563', '2562', '2561'];

  const handleLogout = () => {
  Alert.alert(
    'ออกจากระบบ',
    `คุณต้องการออกจากระบบใช่ไหม ${user?.firstname}?`,
    [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ออกจากระบบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            console.log('Logout successful');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]
  );
};

  const fetchMembers = async (year: string, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    
    try {
      if (!user?.token) {
        Alert.alert('Error', 'Please login first');
        router.replace('/');
        return;
      }

      console.log('📡 Fetching members for year:', year);

      const response = await axios.get(
        `${API_CONFIG.baseURL}/classroom/class/${year}`,
        {
          headers: {
            'accept': 'application/json',
            'x-api-key': API_CONFIG.apiKey,
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      console.log('✅ API Response received, data type:', typeof response.data);

      let membersArray = [];
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        membersArray = response.data.data;
        console.log(`🎯 Found ${membersArray.length} members in response.data.data`);
      } else if (Array.isArray(response.data)) {
        membersArray = response.data;
        console.log(`🎯 Found ${membersArray.length} members in response.data`);
      } else {
        console.log('⚠️ Unexpected response format, but trying to use it...');
        membersArray = response.data ? [response.data] : [];
      }

      const membersData: Member[] = membersArray.map((member: any, index: number) => {
        const studentId = member.education?.studentId || 'ไม่มีรหัสนักศึกษา';
        const major = member.education?.major || 'ไม่ระบุสาขา';
        
        return {
          _id: member._id || `member-${index}`,
          studentId: studentId,
          name: `${member.firstname || ''} ${member.lastname || ''}`.trim() || 'ไม่ระบุชื่อ',
          firstname: member.firstname,
          lastname: member.lastname,
          email: member.email,
          faculty: 'คณะวิทยาศาสตร์',
          department: major,
          major: major,
        };
      });

      console.log('🎉 Successfully processed', membersData.length, 'members');
      setMembers(membersData);
      
    } catch (error: any) {
      console.error('❌ Error fetching members:', error);
      
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again', [
          { text: 'OK', onPress: () => logout() }
        ]);
        return;
      }
      
      Alert.alert('Error', 'Failed to load members');
      
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMembers(selectedYear, true);
  };

  useEffect(() => {
    if (user) {
      fetchMembers(selectedYear);
    }
  }, [selectedYear, user]);

  const renderMemberItem = ({ item }: { item: Member }) => (
    <View style={[
      styles.memberCard,
      isDesktop && styles.memberCardDesktop,
      isTablet && styles.memberCardTablet
    ]}>
      <View style={styles.memberAvatar}>
        <Text style={styles.avatarText}>
          {item.firstname ? item.firstname.charAt(0).toUpperCase() : 'U'}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={[
          styles.memberName,
          isDesktop && styles.memberNameDesktop
        ]}>
          {item.name}
        </Text>
        <Text style={styles.memberId}>รหัส: {item.studentId}</Text>
        {item.major && (
          <Text style={styles.memberFaculty}>สาขา: {item.major}</Text>
        )}
        {item.email && (
          <Text style={styles.memberEmail}>{item.email}</Text>
        )}
      </View>
      <View style={styles.memberStatus}>
        <Text style={styles.memberYear}>ปี {selectedYear}</Text>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    header: {
      backgroundColor: 'white',
      padding: responsiveSpacing(16),
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitleContainer: {
      flex: 1,
    },
    headerTitle: {
      fontSize: responsiveFontSize(20),
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#333',
    },
    welcomeText: {
      textAlign: 'center',
      color: '#007AFF',
      fontSize: responsiveFontSize(14),
      marginTop: responsiveSpacing(4),
    },
    logoutButton: {
      padding: responsiveSpacing(8),
      borderRadius: 8,
      backgroundColor: '#f8f8f8',
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    logoutButtonDesktop: {
      padding: responsiveSpacing(12),
    },
    logoutButtonText: {
      color: '#FF3B30',
      fontWeight: '600',
      fontSize: responsiveFontSize(12),
    },
    logoutButtonTextDesktop: {
      fontSize: responsiveFontSize(14),
    },
    yearSelector: {
      backgroundColor: 'white',
      paddingVertical: responsiveSpacing(10),
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    yearSelectorContent: {
      paddingHorizontal: responsiveSpacing(10),
    },
    yearSelectorContentDesktop: {
      paddingHorizontal: responsiveSpacing(20),
      justifyContent: 'center',
    },
    yearButton: {
      paddingHorizontal: responsiveSpacing(16),
      paddingVertical: responsiveSpacing(8),
      marginHorizontal: responsiveSpacing(4),
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
    },
    yearButtonDesktop: {
      paddingHorizontal: responsiveSpacing(20),
      paddingVertical: responsiveSpacing(10),
      marginHorizontal: responsiveSpacing(6),
    },
    yearButtonActive: {
      backgroundColor: '#007AFF',
    },
    yearButtonText: {
      color: '#666',
      fontWeight: '500',
      fontSize: responsiveFontSize(14),
    },
    yearButtonTextActive: {
      color: 'white',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    loadingText: {
      marginTop: responsiveSpacing(10),
      color: '#666',
      fontSize: responsiveFontSize(16),
    },
    membersList: {
      padding: responsiveSpacing(10),
    },
    membersListDesktop: {
      padding: responsiveSpacing(20),
    },
    columnWrapper: {
      justifyContent: 'space-between',
    },
    memberCard: {
      backgroundColor: 'white',
      padding: responsiveSpacing(12),
      marginBottom: responsiveSpacing(8),
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    memberCardDesktop: {
      flex: 1,
      margin: responsiveSpacing(5),
      padding: responsiveSpacing(16),
      maxWidth: isDesktop ? '48%' : '100%',
    },
    memberCardTablet: {
      padding: responsiveSpacing(14),
    },
    memberAvatar: {
      width: responsiveSpacing(40),
      height: responsiveSpacing(40),
      borderRadius: responsiveSpacing(20),
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: responsiveSpacing(12),
    },
    avatarText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: responsiveFontSize(16),
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: responsiveFontSize(16),
      fontWeight: 'bold',
      marginBottom: responsiveSpacing(4),
      color: '#333',
    },
    memberNameDesktop: {
      fontSize: responsiveFontSize(18),
    },
    memberId: {
      fontSize: responsiveFontSize(14),
      color: '#666',
      marginBottom: responsiveSpacing(2),
    },
    memberFaculty: {
      fontSize: responsiveFontSize(12),
      color: '#007AFF',
      marginBottom: responsiveSpacing(2),
      fontWeight: '500',
    },
    memberEmail: {
      fontSize: responsiveFontSize(11),
      color: '#999',
    },
    memberStatus: {
      alignItems: 'flex-end',
    },
    memberYear: {
      fontSize: responsiveFontSize(12),
      color: '#007AFF',
      fontWeight: '500',
      backgroundColor: '#E3F2FD',
      paddingHorizontal: responsiveSpacing(8),
      paddingVertical: responsiveSpacing(4),
      borderRadius: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: responsiveSpacing(20),
      backgroundColor: '#f5f5f5',
    },
    emptyText: {
      fontSize: responsiveFontSize(16),
      color: '#666',
      textAlign: 'center',
      marginBottom: responsiveSpacing(10),
    },
    retryButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: responsiveSpacing(16),
      paddingVertical: responsiveSpacing(8),
      borderRadius: 8,
    },
    retryButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    successMessage: {
      textAlign: 'center',
      color: '#4CAF50',
      fontSize: responsiveFontSize(12),
      marginTop: responsiveSpacing(5),
      fontWeight: '500',
    },
    iconButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: responsiveSpacing(8),
      borderRadius: 8,
      backgroundColor: '#f8f8f8',
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    iconButtonDesktop: {
      paddingHorizontal: responsiveSpacing(12),
      paddingVertical: responsiveSpacing(10),
    },
    iconButtonText: {
      marginLeft: responsiveSpacing(4),
      color: '#FF3B30',
      fontWeight: '600',
      fontSize: responsiveFontSize(12),
    },
    iconButtonTextDesktop: {
      fontSize: responsiveFontSize(14),
    },
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูลสมาชิก...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>สมาชิกในชั้นปี</Text>
            {user && (
              <Text style={styles.welcomeText}>
                👋 สวัสดี, {user.firstname} {user.lastname}
              </Text>
            )}
            {members.length > 0 && (
              <Text style={styles.successMessage}>
                พบสมาชิก {members.length} คน ในปีการศึกษา {selectedYear}
              </Text>
            )}
          </View>
          
          {/* Logout Button */}
          <TouchableOpacity 
            style={[
              styles.iconButton,
              isDesktop && styles.iconButtonDesktop
            ]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={responsiveFontSize(16)} color="#FF3B30" />
            <Text style={[
              styles.iconButtonText,
              isDesktop && styles.iconButtonTextDesktop
            ]}>
              {isDesktop ? 'ออกจากระบบ' : 'ออก'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Year Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.yearSelector}
        contentContainerStyle={[
          styles.yearSelectorContent,
          isDesktop && styles.yearSelectorContentDesktop
        ]}
      >
        {years.map((year) => (
          <TouchableOpacity
            key={year}
            style={[
              styles.yearButton,
              selectedYear === year && styles.yearButtonActive,
              isDesktop && styles.yearButtonDesktop
            ]}
            onPress={() => setSelectedYear(year)}
          >
            <Text style={[
              styles.yearButtonText,
              selectedYear === year && styles.yearButtonTextActive
            ]}>
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Members List */}
      {members.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>ไม่พบข้อมูลสมาชิกสำหรับปี {selectedYear}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchMembers(selectedYear)}
          >
            <Text style={styles.retryButtonText}>ลองโหลดใหม่</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={item => item._id}
          contentContainerStyle={[
            styles.membersList,
            isDesktop && styles.membersListDesktop
          ]}
          numColumns={isDesktop ? 2 : 1}
          columnWrapperStyle={isDesktop ? styles.columnWrapper : undefined}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        />
      )}
    </View>
  );
}