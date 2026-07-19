import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { semantic } from '@/constants/tokens';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const theme = Colors.light;

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      if (isSignup) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      // On success the auth guard swaps this screen out; no manual navigation.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Pentecost</ThemedText>
        <ThemedText style={styles.subtitle}>
          {isSignup ? 'Create a family account' : 'Welcome back'}
        </ThemedText>

        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
          placeholder="Email"
          placeholderTextColor={theme.icon}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
          placeholder="Password"
          placeholderTextColor={theme.icon}
          secureTextEntry
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={password}
          onChangeText={setPassword}
        />

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Pressable
          style={[styles.button, { backgroundColor: theme.tint }, submitting && styles.disabled]}
          onPress={handleSubmit}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <ThemedText style={[styles.buttonText, { color: theme.background }]}>
              {isSignup ? 'Sign up' : 'Log in'}
            </ThemedText>
          )}
        </Pressable>

        <Pressable
          style={styles.toggle}
          onPress={() => {
            setError(null);
            setMode(isSignup ? 'login' : 'signup');
          }}>
          <ThemedText type="link">
            {isSignup ? 'Already have an account? Log in' : 'New here? Create an account'}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 14,
  },
  subtitle: {
    opacity: 0.6,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  error: {
    color: semantic.error,
    fontSize: 14,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
  toggle: {
    alignItems: 'center',
    paddingVertical: 8,
  },
});
