import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { COLORS } from '../../utils/constants';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('LoginScreen - isAuthenticated changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('LoginScreen - Navigating to MainTabs');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(loginUser({ email: email.trim(), password })).unwrap();
    } catch (err) {
      // Error handling is done in useEffect
    }
  };

  const handleGuestContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.primary }]}>
                <Icon name="shopping-bag" size={40} color="white" />
              </View>
              <Text style={styles.title}>
                Welcome Back
              </Text>
              <Text style={styles.subtitle}>
                Sign in to your account to continue shopping
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.relativeContainer}>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    style={[styles.input, errors.email ? styles.inputError : styles.inputNormal]}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Icon
                    name="email"
                    size={20}
                    color="#9CA3AF"
                    style={styles.iconStyle}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.relativeContainer}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    style={[styles.input, errors.password ? styles.inputError : styles.inputNormal]}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.iconStyle}
                  >
                    <Icon
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text
                  style={[styles.forgotPassword, { color: COLORS.primary }]}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={[styles.loginButton, {
                  backgroundColor: isLoading ? COLORS.gray : COLORS.primary,
                }]}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.loginText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Continue as Guest */}
              <TouchableOpacity
                onPress={handleGuestContinue}
                style={[styles.guestButton, { borderColor: COLORS.primary }]}
              >
                <Text
                  style={[styles.guestText, { color: COLORS.primary }]}
                >
                  Continue as Guest
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text
                  style={[styles.signupLink, { color: COLORS.primary }]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  keyboardView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 48 },
  header: { alignItems: 'center', marginBottom: 48 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  subtitle: { color: '#4b5563', textAlign: 'center' },
  formContainer: { marginBottom: 32 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { color: '#374151', fontWeight: '500', marginBottom: 8 },
  relativeContainer: { position: 'relative' },
  input: { width: '100%', paddingHorizontal: 16, paddingVertical: 12, paddingRight: 48, borderWidth: 1, borderRadius: 8, color: '#1f2937' },
  inputNormal: { borderColor: '#d1d5db' },
  inputError: { borderColor: '#f87171' },
  iconStyle: { position: 'absolute', right: 12, top: 12 },
  error: { color: '#f87171', fontSize: 12, marginTop: 4 },
  forgotPasswordContainer: { marginBottom: 24 },
  forgotPassword: { textAlign: 'right', fontWeight: '500' },
  loginButton: { width: '100%', paddingVertical: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  loginText: { color: 'white', fontSize: 18, fontWeight: '600' },
  guestButton: { width: '100%', paddingVertical: 16, borderWidth: 2, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  guestText: { fontSize: 18, fontWeight: '600' },
  signupContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  signupText: { color: '#4b5563' },
  signupLink: { fontWeight: '600' },
});

export default LoginScreen;
