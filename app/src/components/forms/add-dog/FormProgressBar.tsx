import { XStack, View } from "tamagui";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useRef } from "react";

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function FormProgressBar({ currentStep, totalSteps }: FormProgressBarProps) {
  return (
    <XStack gap="$2" mb="$4" justify="center">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const prevStateRef = useRef(isActive);
        const widthPercent = useSharedValue(isActive ? 100 : 0);
        const translateX = useSharedValue(isActive ? 0 : 0);

        useEffect(() => {
          const wasActive = prevStateRef.current;

          if (isActive && !wasActive) {
            // Activating: fill from left to right
            translateX.value = -100;
            widthPercent.value = withTiming(100, { duration: 250 });
          } else if (!isActive && wasActive) {
            // Deactivating: fill from right to left (slide out to the right)
            widthPercent.value = withTiming(0, { duration: 250 });
            translateX.value = 0;
          }

          prevStateRef.current = isActive;
        }, [isActive]);

        const animatedStyle = useAnimatedStyle(() => ({
          width: `${widthPercent.value}%`,
          alignSelf: "flex-end",
        }));

        return (
          <View
            key={stepNumber}
            width={20}
            height={5}
            rounded="$4"
            bg="$disabledBg"
            overflow="hidden"
            flexDirection="row"
          >
            <AnimatedView
              height="100%"
              bg="$primary"
              style={animatedStyle}
            />
          </View>
        );
      })}
    </XStack>
  );
}
