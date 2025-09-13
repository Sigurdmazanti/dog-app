import { LinearGradient } from "@tamagui/linear-gradient";
import { Spinner, View } from "tamagui";

export function LoadingOverlay() {
  return (
    <View
      position="absolute"
      t={0}
      l={0}
      r={0}
      b={0}
      z={10}
      justify="center"
      items="center"
      pointerEvents="auto"
      height="100%"
      width="100%"
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']}
        position="absolute"
        t={0}
        l={0}
        r={0}
        b={0}
        z={1}
      />
      <Spinner 
        size="large"
        color="$color"
        z={2}
      />
    </View>
  )
}