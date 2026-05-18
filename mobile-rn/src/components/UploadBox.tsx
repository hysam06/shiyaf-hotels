import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import Icon from './Icon';

interface UploadBoxProps {
  label: string;
  uri?: string;
  onImagePicked: (uri: string | undefined) => void;
  aspect?: [number, number];
}

export default function UploadBox({ label, uri, onImagePicked, aspect }: UploadBoxProps) {
  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted' && libraryStatus.status !== 'granted') {
      Alert.alert(
        'Permission Needed',
        'We need camera and media library permissions to capture/upload guest documents.'
      );
      return;
    }

    Alert.alert(
      'Upload Document',
      'Choose source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: aspect || [4, 3],
              quality: 0.8,
            });
            if (!result.canceled && result.assets?.[0]?.uri) {
              onImagePicked(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: aspect || [4, 3],
              quality: 0.8,
            });
            if (!result.canceled && result.assets?.[0]?.uri) {
              onImagePicked(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleClearImage = () => {
    onImagePicked(undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {uri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri }} style={styles.image} />
          {/* Success indicator badge */}
          <View style={styles.successBadge}>
            <Icon name="check" size={12} color={colors.textOnDark} />
            <Text style={styles.successText}>Uploaded</Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearImage}
            activeOpacity={0.8}
          >
            <Text style={styles.clearText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={handleSelectImage}
          activeOpacity={0.7}
        >
          <View style={styles.dashedBox}>
            <Icon name="camera" size={28} color={colors.primary} />
            <Text style={styles.title}>Tap to Capture / Upload</Text>
            <Text style={styles.subtitle}>JPEG or PNG up to 5MB</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold as any,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  uploadArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  dashedBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { marginBottom: spacing.xs },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold as any,
    color: colors.primary,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  previewContainer: {
    position: 'relative',
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    height: 120,
    ...shadows.md,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  successBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  successText: {
    color: colors.textOnDark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold as any,
  },
  clearButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.medium,
  },
  clearText: {
    color: colors.textOnDark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold as any,
  },
});
