import { useEffect, useState } from 'react'
// import { ImagePickerInput } from 'src/components/input/ImagePicker'
import ImagePicker from 'react-native-image-crop-picker';
import { supabase } from 'src/services/supabase/supabaseClient'
import { PrimaryButton } from 'src/styled/button/PrimaryButton'
import { BodyText } from 'src/styled/text/BodyText'
import { Image, Input, YStack } from 'tamagui'

export function StepFive({
  dogAvatar,
  setDogAvatar
}: {
  dogAvatar: string | null
  setDogAvatar: (val: string) => void
}) {

  const size = 200;
  const openImageLibrary = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        compressImageQuality: 0.9,
      });

      if (image.path) 
        setDogAvatar(image.path);
      
    } catch (error) {
      if (error.code === 'E_PICKER_CANCELLED') return;
      console.error('Image selection error:', error);
    }
  };

    return (
    <>
      <YStack items="center" gap="$4">
      {dogAvatar ? (
        <Image
          source={{ uri: dogAvatar }}
          width={size}
          height={size}
          borderRadius={size / 2}
          overflow="hidden"
        />
      ) : (
        <BodyText>No image selected</BodyText>
      )}

      <PrimaryButton onPress={openImageLibrary}>Choose image</PrimaryButton>
    </YStack>
      {/* <ImagePickerInput /> */}
      {/* {avatarUrl ? (
        <>
          <Image 
            src={avatarUrl}
            height={size}
            width={size}
          />
        </>
      ) : (
        <BodyText>No image</BodyText>
      )} */}

      <YStack width={size}>
        <PrimaryButton>
          tryk mig test
        </PrimaryButton>
        <BodyText>
          {/* {uploading ? 'Uploading...' : 'Upload'} */}
        </BodyText>
      </YStack>
      {/* <div style={{ width: size }}>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div> */}
    </>
  )
}

export function Avatar({ url, size, onUpload }) {

}