import { RadioGroup, XStack, Label, SizeTokens } from "tamagui";
import { Pressable } from "react-native";
import { CustomRadioGroupIndicator } from "src/styled/radio/CustomRadioGroupIndicator";
import { CustomRadioGroupItem } from "src/styled/radio/CustomRadioGroupItem";
import { CustomRadioGroupContainer } from "src/styled/radio/CustomRadioGroupContainer";

interface RadioGroupItemProps {
  value: string
  label: string
  size?: SizeTokens
  onSelect?: (value: string) => void
  selected?: boolean
}

export function RadioGroupItem({ size, value, label, onSelect, selected }: RadioGroupItemProps) {
  return (
    <CustomRadioGroupContainer
      width='100%'
      tone={selected ? 'success' : 'inactive'}
      onPress={() => onSelect?.(value)}>
      <CustomRadioGroupItem value={value}>
        <CustomRadioGroupIndicator />
      </CustomRadioGroupItem>
      <Label onPress={() => onSelect?.(value)}>
        {label}
      </Label>
    </CustomRadioGroupContainer>
  );
}
