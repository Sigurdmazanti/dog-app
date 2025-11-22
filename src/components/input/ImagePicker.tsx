import { useState } from "react";
import { View, Image, Button } from "tamagui";
// import ExpoImageCropTool, {
//   OpenCropperOptions,
//   OpenCropperResult,
// } from "expo-image-crop-tool";

// export function ImagePickerWithCrop() {
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [croppedUri, setCroppedUri] = useState<string | null>(null);

//   const pickAndCropImage = async () => {
//     // Pick image
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'],
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (result.canceled || !result.assets || result.assets.length === 0) return;

//     const pickedUri = result.assets[0].uri;

//     // Open cropper
//     let cropResult: OpenCropperResult;
//     try {
//       cropResult = await ExpoImageCropTool.openCropperAsync({
//         imageUri: pickedUri,
//         shape: "circle", // can be "rectangle" or "circle"
//         aspectRatio: 1 / 1, // square crop
//       });
//     } catch (e: any) {
//       console.log("Cropper error:", e);
//       return;
//     }

//     setImageUri(pickedUri);
//     setCroppedUri(cropResult.path);
//   };

//   return (
//     <View flex={1} items="center" justify="center" gap="$4">
//       <Button onPress={pickAndCropImage}>Pick & Crop Image</Button>

//       {imageUri && !croppedUri && (
//         <Image
//           source={{ uri: imageUri }}
//           width={200}
//           height={200}
//           borderRadius={100}
//         />
//       )}

//       {croppedUri && (
//         <Image
//           source={{ uri: croppedUri }}
//           width={200}
//           height={200}
//           borderRadius={100}
//         />
//       )}
//     </View>
//   );
// }
