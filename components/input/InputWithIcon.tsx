import { XStack, useTheme } from 'tamagui'
import { Search } from '@tamagui/lucide-icons'
import { CustomInput } from 'styled/input/Input'

type InputWithIconProps = {
  value?: string
  onChangeText?: (text: string) => void
  placeholder?: string
  icon?: React.ReactNode
}

export function InputWithIcon({
  value = '',
  onChangeText = () => {},
  placeholder = '',
  icon = <Search strokeWidth={1.75} size={20} />,
}: InputWithIconProps) {

  return (
    <XStack
      items="center"
      rounded="$4"
      borderWidth="$0.5"
      borderColor="$borderColor"
      px="$2"
      mb="$4"
    >
      {icon}
      <CustomInput
        flex={1}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </XStack>
  )
}
