import { XStack, useTheme } from 'tamagui'
import { CustomInput } from 'src/styled/input/Input'
import { SearchIcon } from 'src/assets/icons/Search'

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
  icon = <SearchIcon strokeWidth={1.75} size={20} />,
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
