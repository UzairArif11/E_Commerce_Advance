import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchOrders } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS } from '../utils/constants';
import Toast from 'react-native-toast-message';

const OrderHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      await dispatch(fetchOrders()).unwrap();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load orders',
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'processing':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'shipped':
        return { backgroundColor: '#e9d5ff', color: '#7c2d12' };
      case 'delivered':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'cancelled':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'hourglass-outline';
      case 'processing':
        return 'build-outline';
      case 'shipped':
        return 'car-outline';
      case 'delivered':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return styles.statusPending;
      case 'processing':
        return styles.statusProcessing;
      case 'shipped':
        return styles.statusShipped;
      case 'delivered':
        return styles.statusDelivered;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const OrderItem = ({ order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetail', { orderId: order._id })}
      activeOpacity={0.7}
    >
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>
            Order #{order.orderNumber || order._id?.slice(-8)}
          </Text>
          <Text style={styles.orderDate}>
            Placed on {formatDate(order.createdAt)}
          </Text>
        </View>
        <View style={[styles.statusBadge, getStatusColor(order.status)]}>
          <View style={styles.statusContent}>
            <Icon 
              name={getStatusIcon(order.status)} 
              size={14} 
              color={order.status?.toLowerCase() === 'delivered' ? '#16a34a' : 
                     order.status?.toLowerCase() === 'cancelled' ? '#dc2626' :
                     order.status?.toLowerCase() === 'shipped' ? '#7c3aed' :
                     order.status?.toLowerCase() === 'processing' ? '#2563eb' : '#ca8a04'} 
            />
            <Text style={styles.statusText}>
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
            </Text>
          </View>
        </View>
      </View>

      {/* Order Items Preview */}
      <View style={styles.orderItems}>
        {(order.products || order.items)?.slice(0, 2).map((item, index) => (
          <View key={index} style={styles.orderItemRow}>
            <View style={styles.productImage}>
              {item.product?.images?.[0] ? (
                <Image
                  source={{ uri: item.product.images[0] }}
                  style={styles.productImageImg}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.productImagePlaceholder}>
                  <Icon name="image-outline" size={20} color={COLORS.gray[400]} />
                </View>
              )}
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.product?.name || item.name || 'Product'}
              </Text>
              <Text style={styles.productDetails}>
                Qty: {item.quantity} × {formatPrice(item.price)}
              </Text>
            </View>
          </View>
        ))}
        {(order.products || order.items)?.length > 2 && (
          <Text style={styles.moreItemsText}>
            +{(order.products || order.items).length - 2} more items
          </Text>
        )}
      </View>

      {/* Order Footer */}
      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>
            {formatPrice(order.totalAmount)}
          </Text>
        </View>
        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Icon name="chevron-forward" size={18} color={COLORS.primary[600]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Icon name="receipt-outline" size={40} color={COLORS.gray[400]} />
      </View>
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptyMessage}>
        You haven't placed any orders yet. Start shopping to see your orders here.
      </Text>
      <TouchableOpacity
        style={styles.startShoppingButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.startShoppingText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerTitle}>Order History</Text>
        </View>
      </View>

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <OrderItem order={item} />}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6366f1']}
              tintColor="#6366f1"
            />
          }
        />
      ) : (
        <EmptyState />
      )}

      {/* Filter/Sort Options (Optional) */}
      <View style={styles.filterContainer}>
        <View style={styles.filterContent}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => Toast.show({type: 'info', text1: 'Filter options coming soon!'})}
          >
            <Icon name="filter-outline" size={18} color={COLORS.gray[700]} />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => Toast.show({type: 'info', text1: 'Sort options coming soon!'})}
          >
            <Icon name="swap-vertical-outline" size={18} color={COLORS.gray[700]} />
            <Text style={styles.filterButtonText}>Sort</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  orderItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusProcessing: {
    backgroundColor: '#dbeafe',
  },
  statusShipped: {
    backgroundColor: '#e9d5ff',
  },
  statusDelivered: {
    backgroundColor: '#dcfce7',
  },
  statusCancelled: {
    backgroundColor: '#fee2e2',
  },
  statusDefault: {
    backgroundColor: COLORS.gray[100],
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  productImageImg: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  moreItemsText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    backgroundColor: COLORS.gray[100],
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: COLORS.gray[500],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  startShoppingButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startShoppingText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  filterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[700],
    marginLeft: 8,
  },
});

export default OrderHistoryScreen;
