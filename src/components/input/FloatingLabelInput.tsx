import React, { useState, useEffect, useRef } from 'react';
import { TextInputProps } from 'react-native';
import { Button, YStack, Text, getVariableValue, useControllableState } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { CustomInput } from 'src/styled/input/Input';
import { CustomLabel } from 'src/styled/input/Label';
import { ShowPasswordIcon } from 'src/assets/icons/ShowPassword';
import { HidePasswordIcon } from 'src/assets/icons/HidePassword';

type FloatingLabelCustomInputProps = {
  label: string;
  hideValue?: boolean;
} & TextInputProps;

const AnimatedLabel = Animated.createAnimatedComponent(CustomLabel);

export function FloatingLabelInput({
  label,
  hideValue = false,
  value,
  onChangeText,
  ...rest
}: FloatingLabelCustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [labelState, setLabelState] = useControllableState({
    prop: isFocused || !!value ? 1 : 0,
    defaultProp: 0,
  });
  const [hideFieldValue, setHideFieldValue] = useState(hideValue)

  const anim = useSharedValue(isFocused || !!value ? 1 : 0);

  useEffect(() => {
    const target = isFocused || !!value ? 1 : 0;
    setLabelState(target);
    anim.value = withTiming(target, { duration: 200 });
  }, [isFocused, value, setLabelState]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(anim.value, [0, 1], [0, -20]) },
      ],
      fontSize: interpolate(anim.value, [0, 1], [16, 12]),
      lineHeight: interpolate(anim.value, [0, 1], [20, 16]),
    };
  });
  
  return (
    <YStack position="relative">
      <AnimatedLabel
        position="absolute"
        l={0}
        b={10}
        style={animatedStyle}
        color='$primaryText'
        pointerEvents="none"
      >
        {label}
      </AnimatedLabel>

      <CustomInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={hideValue}
        focusStyle={{ borderBottomColor: '$primaryText' }}
        borderBottomWidth={1}
        borderBottomColor='$primaryText'
        height={50}
        pt={16}
        pl={0}
        {...rest}
      />

      {hideValue && (
        <Button
          onPressIn={() => setHideFieldValue(false)}
          onPressOut={() => setHideFieldValue(true)} 
          position="absolute"
          r={0}
          p={0}
          chromeless
          z={2}
        >
          {hideFieldValue ? <ShowPasswordIcon strokeWidth={0.85} /> : <HidePasswordIcon strokeWidth={0.85} /> }
        </Button>
      )}

      {hideValue && !hideFieldValue && (
        <Text
          position='absolute'
          color='$primaryText'
          bg='$background'
          b={10}
          z={1}
          width='100%'
        >
          {value}
        </Text>
      )}
    </YStack>
  );
}
