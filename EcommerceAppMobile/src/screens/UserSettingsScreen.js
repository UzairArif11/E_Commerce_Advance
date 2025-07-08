import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { updateSettings } from '../store/slices/authSlice';
import { COLORS } from '../utils/constants';
import CustomButton from '../components/CustomButton';
import api from '../utils/api';
import Toast from 'react-native-toast-message';

const UserSettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [wantsEmailNotifications, setWantsEmailNotifications] = useState(true);
  const [wantsNotificationSound, setWantsNotificationSound] = useState(true);
  const [wantsPushNotifications, setWantsPushNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setWantsEmailNotifications(userInfo.wantsEmailNotifications ?? true);
      setWantsNotificationSound(userInfo.wantsNotificationSound ?? true);
      setWantsPushNotifications(userInfo.wantsPushNotifications ?? true);
    }
  }, [userInfo]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await api.put('/users/settings', {
        wantsEmailNotifications,
        wantsNotificationSound,
        wantsPushNotifications
      });
      
      dispatch(updateSettings({
        wantsEmailNotifications,
        wantsNotificationSound,
        wantsPushNotifications
      }));
      
      Toast.show({
        type: 'success',
        text1: 'Settings Updated',
        text2: 'Your notification preferences have been saved',
      });
    } catch (error) {
      console.error('Error updating settings:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Failed to update notification settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const SettingItem = ({ title, description, value, onToggle, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={20} color={COLORS.primary[600]} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
        thumbColor={value ? COLORS.primary[600] : COLORS.gray[400]}
        ios_backgroundColor={COLORS.gray[300]}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notification Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <Text style={styles.sectionDescription}>
            Configure how you'd like to receive notifications
          </Text>

          <View style={styles.settingsContainer}>
            <SettingItem
              title="Email Notifications"
              description="Receive order updates and promotions via email"
              value={wantsEmailNotifications}
              onToggle={setWantsEmailNotifications}
              icon="mail-outline"
            />

            <SettingItem
              title="Push Notifications"
              description="Get instant notifications on your device"
              value={wantsPushNotifications}
              onToggle={setWantsPushNotifications}
              icon="notifications-outline"
            />

            <SettingItem
              title="Notification Sound"
              description="Play sound when receiving notifications"
              value={wantsNotificationSound}
              onToggle={setWantsNotificationSound}
              icon="volume-medium-outline"
            />
          </View>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userInfo?.email || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{userInfo?.name || 'Not provided'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <CustomButton
          title="Save Settings"
          onPress={handleSaveSettings}
          loading={loading}
          style={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 16,
  },
  settingsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary[50],
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[600],
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.gray[900],
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  saveButton: {
    marginTop: 8,
  },
});

export default UserSettingsScreen;
