import { View, XStack } from 'tamagui'
import { CustomInput } from 'src/styled/input/CustomInput'
import { BodyText } from 'src/styled/text/BodyText'
import { useState } from 'react'

type BorderedInputProps = {
  valueType?: string
  icon?: React.ReactNode
} & React.ComponentProps<typeof CustomInput>

export function BorderedInput({
  valueType,
  icon, 
  ...customInputProps
}: BorderedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  return (
    <View
      overflow="hidden"
      width={306}
      ml={-3}
      mt={-3}
      p={3}
      items="center"
      bg={isFocused ? '$inputFocusOutline' : 'transparent'}
      rounded="$4">
        
      <XStack
        p={0}
        m={0}
        height={44}
        items="center"
        rounded="$3"
        borderWidth="$0.5"
        borderColor={isFocused ? '$inputFocusBorder' : '$borderColor'}
        bg="$inputBg"
        overflow="hidden"
      >
        {icon && (
          <View pl="$4" bg="$inputBg">
            {icon}
          </View>
        )}
        
        <CustomInput
          onFocus={onFocus}
          onBlur={onBlur}
          bg="transparent"
          borderWidth={0}
          borderColor='transparent'
          rounded={0}
          maxW="100%"
          width="100%"
          flex={1}
          minW={0}
          shrink={1}
          grow={1}
          {...customInputProps}
        />
        
        {valueType && (
          <View bg='white' height='100%' items='center' justify='center' rounded="$3" borderBottomLeftRadius={0} borderTopLeftRadius={0}>
            <BodyText px="$5" fontSize="$2">{valueType}</BodyText>
          </View>
        )}
      </XStack>
    </View>
  )
}
