import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { avatarColors as AVATAR_COLORS, palette, semantic } from '@/constants/tokens';
import { useProfiles } from '@/lib/profile-context';
import { AGE_TIERS, AgeTier, ChildProfile, createProfile } from '@/lib/profiles';
import { useAuth } from '@/lib/auth-context';

export default function SelectProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { profiles, loading, selectProfile } = useProfiles();
  const theme = Colors.light;

  const [adding, setAdding] = useState(false);

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 24 }]}>
      <ThemedText type="title">{"Who's reading today?"}</ThemedText>

      {loading ? (
        <ActivityIndicator style={styles.loading} color={theme.tint} />
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {profiles.map((profile) => (
            <ProfileChip
              key={profile.id}
              profile={profile}
              onPress={() => selectProfile(profile)}
            />
          ))}
          <AddChip onPress={() => setAdding(true)} borderColor={theme.icon} />
        </ScrollView>
      )}

      {adding && user && (
        <AddProfileForm uid={user.uid} theme={theme} onClose={() => setAdding(false)} />
      )}
    </ThemedView>
  );
}

function ProfileChip({ profile, onPress }: { profile: ChildProfile; onPress: () => void }) {
  return (
    <Pressable style={styles.chip} onPress={onPress} accessibilityLabel={profile.name}>
      <View style={[styles.avatar, { backgroundColor: profile.avatar }]}>
        <ThemedText style={styles.avatarInitial}>{profile.name.charAt(0).toUpperCase()}</ThemedText>
      </View>
      <ThemedText type="defaultSemiBold" numberOfLines={1}>
        {profile.name}
      </ThemedText>
    </Pressable>
  );
}

function AddChip({ onPress, borderColor }: { onPress: () => void; borderColor: string }) {
  return (
    <Pressable style={styles.chip} onPress={onPress} accessibilityLabel="Add a profile">
      <View style={[styles.avatar, styles.addAvatar, { borderColor }]}>
        <IconSymbol name="plus" size={32} color={borderColor} />
      </View>
      <ThemedText type="defaultSemiBold">Add</ThemedText>
    </Pressable>
  );
}

function AddProfileForm({
  uid,
  theme,
  onClose,
}: {
  uid: string;
  theme: (typeof Colors)['light'];
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [tier, setTier] = useState<AgeTier>('tier1');
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length > 0 && !saving;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      await createProfile(uid, { name: name.trim(), ageTier: tier, avatar: color });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={[styles.form, { borderColor: theme.icon, backgroundColor: theme.background }]}>
      <ThemedText type="sectionHeader">New profile</ThemedText>

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
        placeholder="Child's name"
        placeholderTextColor={theme.icon}
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <View style={styles.row}>
        {AGE_TIERS.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.tierButton,
              { borderColor: theme.icon },
              tier === option.value && { backgroundColor: theme.tint, borderColor: theme.tint },
            ]}
            onPress={() => setTier(option.value)}>
            <ThemedText style={tier === option.value ? { color: theme.background } : undefined}>
              {option.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.row}>
        {AVATAR_COLORS.map((swatch) => (
          <Pressable
            key={swatch}
            style={[
              styles.swatch,
              { backgroundColor: swatch },
              color === swatch && styles.swatchSelected,
            ]}
            onPress={() => setColor(swatch)}
            accessibilityLabel={`Avatar color ${swatch}`}
          />
        ))}
      </View>

      <View style={styles.formActions}>
        <Pressable style={styles.textButton} onPress={onClose} disabled={saving}>
          <ThemedText type="link">Cancel</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: theme.tint }, !canSave && styles.disabled]}
          onPress={handleSave}
          disabled={!canSave}>
          {saving ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <ThemedText style={[styles.buttonText, { color: theme.background }]}>Save</ThemedText>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  loading: {
    marginTop: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    paddingVertical: 8,
  },
  chip: {
    alignItems: 'center',
    gap: 8,
    width: 88,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAvatar: {
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  avatarInitial: {
    color: semantic.onAccent,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  form: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  tierButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: palette.textPrimary,
  },
  formActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  textButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    minWidth: 88,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
