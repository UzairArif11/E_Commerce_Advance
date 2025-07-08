import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { selectCartItems, selectCartTotal } from '../store/slices/cartSlice';
import { setShippingAddress, setPaymentMethod } from '../store/slices/checkoutSlice';
import { COLORS } from '../utils/constants';
import CustomButton from '../components/CustomButton';
import api from '../utils/api';
import Toast from 'react-native-toast-message';

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotal);
  const { shippingAddress, paymentMethod } = useSelector((state) => state.checkout);

  const [address, setAddress] = useState(shippingAddress || '');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethod || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Payment method availability - matching web client structure
  const [paymentMethods, setPaymentMethods] = useState({
    codEnabled: false,
    jazzCashEnabled: false,
    easypaisaEnabled: false,
    cardEnabled: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setPaymentMethods({
        codEnabled: response.data.codEnabled,
        jazzCashEnabled: response.data.jazzCashEnabled,
        easypaisaEnabled: response.data.easypaisaEnabled,
        cardEnabled: response.data.cardEnabled,
      });
    } catch (error) {
      console.error('Failed to load payment settings:', error.message);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!address.trim()) {
      newErrors.address = 'Shipping address is required.';
    }

    if (!selectedPayment) {
      newErrors.payment = 'Please select a payment method.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all required fields',
      });
      return;
    }

    if (cartItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Empty Cart',
        text2: 'Please add items to cart before checkout',
      });
      return;
    }

    dispatch(setShippingAddress(address));
    dispatch(setPaymentMethod(selectedPayment));
    navigation.navigate('PlaceOrder');
  };

  const PaymentMethodItem = ({ method }) => {
    const isSelected = selectedPayment === method.id;
    
    return (
      <TouchableOpacity
        style={[styles.paymentMethod, isSelected && styles.selectedPaymentMethod]}
        onPress={() => setSelectedPayment(method.id)}
      >
        <View style={styles.paymentMethodContent}>
          <View style={styles.paymentMethodLeft}>
            <Icon name={method.icon} size={24} color={COLORS.gray[600]} />
            <Text style={styles.paymentMethodText}>{method.name}</Text>
          </View>
          <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
            {isSelected && <View style={styles.radioButtonInner} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const CartSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      
      {cartItems.map((item) => (
        <View key={item.productId} style={styles.summaryItem}>
          <Text style={styles.summaryItemName} numberOfLines={1}>
            {item.name} x {item.quantity}
          </Text>
          <Text style={styles.summaryItemPrice}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}
      
      <View style={styles.summaryDivider} />
      
      {selectedPayment === 'CashOnDelivery' && (
        <View style={styles.summaryItem}>
          <Text style={styles.summaryItemName}>COD Charges</Text>
          <Text style={styles.summaryItemPrice}>$100.00</Text>
        </View>
      )}
      
      <View style={styles.summaryTotal}>
        <Text style={styles.summaryTotalText}>Total Amount</Text>
        <Text style={styles.summaryTotalAmount}>
          ${(totalAmount + (selectedPayment === 'CashOnDelivery' ? 100 : 0)).toFixed(2)}
        </Text>
      </View>
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
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <TextInput
            style={[styles.textInput, errors.address && styles.textInputError]}
            placeholder="Enter your complete shipping address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {paymentMethods.cardEnabled && (
            <PaymentMethodItem
              method={{
                id: 'Card',
                name: 'Card',
                icon: 'card-outline'
              }}
            />
          )}
          
          {paymentMethods.jazzCashEnabled && (
            <PaymentMethodItem
              method={{
                id: 'JazzCash',
                name: 'JazzCash',
                icon: 'phone-portrait-outline'
              }}
            />
          )}
          
          {paymentMethods.easypaisaEnabled && (
            <PaymentMethodItem
              method={{
                id: 'EasyPaisa',
                name: 'EasyPaisa',
                icon: 'phone-portrait-outline'
              }}
            />
          )}
          
          {paymentMethods.codEnabled && (
            <PaymentMethodItem
              method={{
                id: 'CashOnDelivery',
                name: 'Cash On Delivery (+Rs 100 Extra)',
                icon: 'cash-outline'
              }}
            />
          )}
          
          {errors.payment && (
            <Text style={styles.errorText}>{errors.payment}</Text>
          )}
        </View>

        {/* Order Summary */}
        <CartSummary />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <CustomButton
          title="Continue to Payment"
          onPress={handleContinue}
          loading={loading}
          style={styles.continueButton}
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  textInputError: {
    borderColor: COLORS.error[500],
  },
  errorText: {
    color: COLORS.error[500],
    fontSize: 14,
    marginTop: 4,
  },
  paymentMethod: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary[500],
    backgroundColor: COLORS.primary[50],
  },
  paymentMethodContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    color: COLORS.gray[900],
    marginLeft: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary[500],
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary[500],
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryItemName: {
    fontSize: 14,
    color: COLORS.gray[600],
    flex: 1,
    marginRight: 8,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginVertical: 12,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  summaryTotalText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  summaryTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary[600],
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  continueButton: {
    marginTop: 8,
  },
});

export default CheckoutScreen;
