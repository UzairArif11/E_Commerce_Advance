import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout, updateProfile } from '../store/slices/authSlice';
import CustomButton from '../components/CustomButton';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const ProfileItem = ({ icon, label, value, editable = true }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileItemHeader}>
        <Icon name={icon} size={20} color="#6366f1" />
        <Text style={styles.profileItemLabel}>{label}</Text>
      </View>
      {isEditing && editable ? (
        <TextInput
          style={styles.profileItemInput}
          value={value}
          onChangeText={(text) => handleInputChange(label.toLowerCase(), text)}
          placeholder={`Enter ${label.toLowerCase()}`}
          keyboardType={label === 'Email' ? 'email-address' : label === 'Phone' ? 'phone-pad' : 'default'}
        />
      ) : (
        <Text style={styles.profileItemValue}>
          {value || 'Not provided'}
        </Text>
      )}
    </View>
  );

  const MenuOption = ({ icon, title, subtitle, onPress, showArrow = true, color = '#111827' }) => (
    <TouchableOpacity
      style={styles.menuOption}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuOptionContent}>
        <View style={styles.menuOptionIcon}>
          <Icon name={icon} size={20} color="#6366f1" />
        </View>
        <View style={styles.menuOptionText}>
          <Text style={[styles.menuOptionTitle, { color }]}>{title}</Text>
          {subtitle && (
            <Text style={styles.menuOptionSubtitle}>{subtitle}</Text>
          )}
        </View>
        {showArrow && (
          <Icon name="chevron-forward" size={20} color="#9ca3af" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
<View style={styles.header}>
        <View style={styles.headerContent}>
<TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
<Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                handleUpdateProfile();
              } else {
                setIsEditing(true);
              }
            }}
            style={styles.editButton}
          >
            <Icon 
              name={isEditing ? "checkmark" : "create-outline"} 
              size={20} 
              color="#6366f1" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Icon name="person" size={40} color="#6366f1" />
            )}
          </View>
          <Text style={styles.userName}>
            {user?.name || 'User Name'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Text>
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Information */}
        <View style={styles.profileInfoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <ProfileItem
            icon="person-outline"
            label="Name"
            value={formData.name}
          />
          <ProfileItem
            icon="mail-outline"
            label="Email"
            value={formData.email}
            editable={false}
          />
          <ProfileItem
            icon="call-outline"
            label="Phone"
            value={formData.phone}
          />
          <ProfileItem
            icon="location-outline"
            label="Address"
            value={formData.address}
          />
        </View>

        {!isEditing && (
          <>
            {/* Menu Options */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Account</Text>
              
              <MenuOption
                icon="time-outline"
                title="Order History"
                subtitle="View your past orders"
                onPress={() => navigation.navigate('OrderHistory')}
              />
              
              <MenuOption
                icon="heart-outline"
                title="Wishlist"
                subtitle="Your saved items"
                onPress={() => navigation.navigate('Wishlist')}
              />
              
              <MenuOption
                icon="card-outline"
                title="Payment Methods"
                subtitle="Manage your cards"
                onPress={() => Alert.alert('Info', 'Payment methods coming soon!')}
              />
              
              <MenuOption
                icon="location-outline"
                title="Addresses"
                subtitle="Manage delivery addresses"
                onPress={() => Alert.alert('Info', 'Address management coming soon!')}
              />
            </View>

            {/* Settings */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Settings</Text>
              
              <MenuOption
                icon="notifications-outline"
                title="Notifications"
                subtitle="View your notifications"
                onPress={() => navigation.navigate('Notifications')}
              />
              
              <MenuOption
                icon="settings-outline"
                title="Account Settings"
                subtitle="Notification preferences"
                onPress={() => navigation.navigate('UserSettings')}
              />
              
              <MenuOption
                icon="help-circle-outline"
                title="Help & Support"
                subtitle="FAQ, contact us"
                onPress={() => Alert.alert('Info', 'Help & Support coming soon!')}
              />
              
              <MenuOption
                icon="information-circle-outline"
                title="About"
                subtitle="App version, terms & conditions"
                onPress={() => Alert.alert('Info', 'About section coming soon!')}
              />
            </View>

            {/* Logout */}
            <View style={styles.logoutSection}>
              <MenuOption
                icon="log-out-outline"
                title="Logout"
                subtitle="Sign out of your account"
                onPress={handleLogout}
                showArrow={false}
                color="text-red-600"
              />
            </View>
          </>
        )}

        {isEditing && (
          <View style={styles.editingSection}>
            <CustomButton
              title="Cancel"
              onPress={() => {
                setIsEditing(false);
                // Reset form data
                setFormData({
                  name: user?.name || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  address: user?.address || '',
                });
              }}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileHeader: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  changePhotoButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#6366f1',
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  profileInfoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  profileItem: {
    marginBottom: 16,
  },
  profileItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
  },
  profileItemInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  profileItemValue: {
    fontSize: 16,
    color: '#6b7280',
    paddingLeft: 32,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuOption: {
    marginBottom: 8,
  },
  menuOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuOptionText: {
    flex: 1,
  },
  menuOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuOptionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editingSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  cancelButton: {
    marginTop: 12,
  },
});

export default ProfileScreen;
