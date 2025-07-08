import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { selectCartItems, selectCartTotal, clearCartAsync } from '../store/slices/cartSlice';
import { COLORS } from '../utils/constants';
import CustomButton from '../components/CustomButton';
import api from '../utils/api';
import Toast from 'react-native-toast-message';

const PlaceOrderScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotal);
  const { shippingAddress, paymentMethod } = useSelector((state) => state.checkout);
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const finalAmount = totalAmount + (paymentMethod === 'CashOnDelivery' ? 100 : 0);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Empty Cart',
        text2: 'Your cart is empty',
      });
      return;
    }

    if (!shippingAddress || !paymentMethod) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please complete checkout information',
      });
      navigation.goBack();
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'Card' || paymentMethod === 'Stripe') {
        await handleStripePayment();
      } else {
        await handleDirectOrder();
      }
    } catch (error) {
      console.error('Payment error:', error);
      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: error.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      // Create payment intent
      const { data: { paymentIntent } } = await api.post('/payments/stripe', {
        amount: finalAmount * 100, // Stripe expects amount in cents
        currency: 'usd',
        cartItems,
        shippingAddress,
      });

      // For mobile, we'll simulate successful payment
      // In a real app, you'd use react-native-stripe-sdk
      await simulatePaymentSuccess();
      
      await handleDirectOrder();
    } catch (error) {
      throw new Error('Stripe payment failed: ' + error.message);
    }
  };

  const simulatePaymentSuccess = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const handleDirectOrder = async () => {
    try {
      const orderData = {
        products: cartItems.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        totalAmount: finalAmount,
        paymentMethod,
      };

      await api.post('/orders', orderData);
      
      setOrderPlaced(true);
      dispatch(clearCartAsync());
      
      Toast.show({
        type: 'success',
        text1: 'Order Placed Successfully! 🎉',
        text2: 'You will receive a confirmation email shortly',
      });

      // Navigate to orders after a delay
      setTimeout(() => {
        navigation.navigate('OrderHistory');
      }, 2000);
      
    } catch (error) {
      throw new Error('Failed to place order: ' + error.message);
    }
  };

  const OrderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      
      {cartItems.map((item) => (
        <View key={item.productId} style={styles.summaryItem}>
          <Text style={styles.summaryItemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.summaryItemDetails}>
            Qty: {item.quantity} × ${item.price.toFixed(2)}
          </Text>
          <Text style={styles.summaryItemPrice}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}
      
      <View style={styles.summaryDivider} />
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
      </View>
      
      {paymentMethod === 'CashOnDelivery' && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>COD Charges</Text>
          <Text style={styles.summaryValue}>$100.00</Text>
        </View>
      )}
      
      <View style={styles.summaryDivider} />
      
      <View style={styles.summaryTotal}>
        <Text style={styles.summaryTotalText}>Total Amount</Text>
        <Text style={styles.summaryTotalAmount}>
          ${finalAmount.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const PaymentInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.infoTitle}>Payment Information</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Payment Method:</Text>
        <Text style={styles.infoValue}>{paymentMethod}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Shipping Address:</Text>
        <Text style={styles.infoValue} numberOfLines={3}>
          {shippingAddress}
        </Text>
      </View>
    </View>
  );

  if (orderPlaced) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Icon name="checkmark-circle" size={80} color={COLORS.success[500]} />
          </View>
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successMessage}>
            Thank you for your order. You will receive a confirmation email shortly.
          </Text>
          <CustomButton
            title="View Orders"
            onPress={() => navigation.navigate('OrderHistory')}
            style={styles.successButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          disabled={loading}
        >
          <Icon name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Place Order</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <PaymentInfo />
        <OrderSummary />
        
        {(paymentMethod === 'Card' || paymentMethod === 'Stripe') && (
          <View style={styles.paymentNote}>
            <Icon name="information-circle-outline" size={20} color={COLORS.primary[500]} />
            <Text style={styles.paymentNoteText}>
              Your payment will be processed securely via Stripe
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <CustomButton
          title={loading ? 'Processing...' : `Place Order - $${finalAmount.toFixed(2)}`}
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading}
          style={styles.placeOrderButton}
        />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary[500]} />
            <Text style={styles.loadingText}>
              {(paymentMethod === 'Card' || paymentMethod === 'Stripe') ? 'Processing Payment...' : 'Placing Order...'}
            </Text>
          </View>
        </View>
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 12,
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
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  summaryItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  summaryItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  summaryItemDetails: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 4,
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  summaryTotalText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  summaryTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary[600],
  },
  paymentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  paymentNoteText: {
    fontSize: 14,
    color: COLORS.primary[700],
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  placeOrderButton: {
    marginTop: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.gray[900],
    marginTop: 12,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  successButton: {
    paddingHorizontal: 32,
  },
});

export default PlaceOrderScreen;
