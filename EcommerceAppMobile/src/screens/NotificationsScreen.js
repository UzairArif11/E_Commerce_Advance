import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllAsRead,
  clearAllNotifications,
  setFilter,
  resetPagination,
  selectFilteredNotifications,
  selectUnreadCount,
  selectNotificationsLoading,
  selectNotificationFilter,
  selectHasMoreNotifications,
} from '../store/slices/notificationSlice';
import { COLORS } from '../utils/constants';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectFilteredNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const isLoading = useSelector(selectNotificationsLoading);
  const currentFilter = useSelector(selectNotificationFilter);
  const hasMore = useSelector(selectHasMoreNotifications);
  
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { key: 'all', label: 'All', icon: 'list-outline' },
    { key: 'unread', label: 'Unread', icon: 'mail-unread-outline' },
    { key: 'read', label: 'Read', icon: 'mail-open-outline' },
    { key: 'broadcast', label: 'Broadcasts', icon: 'megaphone-outline' },
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      await dispatch(fetchNotifications({ page: 1, limit: 10 })).unwrap();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load notifications',
      });
    }
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(resetPagination());
    await loadNotifications();
    setRefreshing(false);
  }, [loadNotifications, dispatch]);

  const loadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      try {
        await dispatch(fetchNotifications({ limit: 10 })).unwrap();
      } catch (error) {
        console.error('Failed to load more notifications:', error);
      }
    }
  }, [hasMore, isLoading, dispatch]);

  const handleNotificationPress = useCallback(async (notification) => {
    if (!notification.read) {
      try {
        await dispatch(markNotificationAsRead(notification._id)).unwrap();
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  }, [dispatch]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'All notifications marked as read',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to mark all as read',
      });
    }
  }, [dispatch]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(clearAllNotifications()).unwrap();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'All notifications cleared',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to clear notifications',
              });
            }
          },
        },
      ]
    );
  }, [dispatch]);

  const handleFilterChange = useCallback((filter) => {
    dispatch(setFilter(filter));
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (notification) => {
    if (notification.type === 'broadcast') return 'megaphone';
    if (notification.type === 'order') return 'receipt';
    if (notification.type === 'delivered') return 'checkmark-circle';
    if (notification.type === 'shipped') return 'car';
    if (notification.type === 'cancelled') return 'close-circle';
    return 'notifications';
  };

  const getNotificationIconColor = (notification) => {
    if (notification.type === 'delivered') return COLORS.success[500];
    if (notification.type === 'shipped') return COLORS.primary[500];
    if (notification.type === 'cancelled') return COLORS.error[500];
    if (notification.type === 'broadcast') return COLORS.warning[500];
    return COLORS.gray[500];
  };

  const NotificationItem = ({ notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationIcon}>
        <Icon
          name={getNotificationIcon(notification)}
          size={24}
          color={getNotificationIconColor(notification)}
        />
      </View>
      
      <View style={styles.notificationContent}>
        <Text
          style={[
            styles.notificationText,
            !notification.read && styles.unreadText,
          ]}
          numberOfLines={3}
        >
          {notification.message}
        </Text>
        <Text style={styles.notificationDate}>
          {formatDate(notification.createdAt)}
        </Text>
      </View>
      
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const FilterTab = ({ filter }) => {
    const isActive = currentFilter === filter.key;
    
    return (
      <TouchableOpacity
        style={[styles.filterTab, isActive && styles.activeFilterTab]}
        onPress={() => handleFilterChange(filter.key)}
      >
        <Icon
          name={filter.icon}
          size={18}
          color={isActive ? COLORS.white : COLORS.gray[600]}
        />
        <Text
          style={[
            styles.filterTabText,
            isActive && styles.activeFilterTabText,
          ]}
        >
          {filter.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Icon name="notifications-off-outline" size={64} color={COLORS.gray[400]} />
      </View>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>
        {currentFilter === 'unread'
          ? "You're all caught up! No unread notifications."
          : 'You have no notifications at the moment.'}
      </Text>
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
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <CustomButton
          title="Mark All Read"
          onPress={handleMarkAllAsRead}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
          disabled={unreadCount === 0}
        />
        <CustomButton
          title="Clear All"
          onPress={handleClearAll}
          style={[styles.actionButton, styles.clearButton]}
          textStyle={styles.clearButtonText}
          disabled={notifications.length === 0}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <FilterTab key={filter.key} filter={filter} />
        ))}
      </View>

      {/* Notifications List */}
      {notifications.length === 0 && !isLoading ? (
        <EmptyState />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <NotificationItem notification={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary[500]]}
              tintColor={COLORS.primary[500]}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isLoading && notifications.length > 0 ? (
              <View style={styles.loadingFooter}>
                <Text style={styles.loadingText}>Loading more...</Text>
              </View>
            ) : null
          }
        />
      )}
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
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: COLORS.error[500],
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: COLORS.primary[500],
  },
  actionButtonText: {
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: COLORS.error[500],
  },
  clearButtonText: {
    color: COLORS.white,
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary[500],
  },
  filterTabText: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  activeFilterTabText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    backgroundColor: COLORS.primary[50],
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary[500],
  },
  notificationIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: COLORS.gray[700],
    lineHeight: 22,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  notificationDate: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[500],
    marginLeft: 8,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingFooter: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
});

export default NotificationsScreen;
