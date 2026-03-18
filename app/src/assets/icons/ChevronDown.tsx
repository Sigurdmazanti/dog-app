import { Svg, Path, SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'
import { memo } from 'react'

const Icon = (propsBase: IconProps) => {
  const { color, size = 24, strokeWidth = 1.5, ...otherProps } = propsBase as SvgProps & { size?: number }

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...otherProps}
    >
      <Path
        d="M7 9.5L12 14.5L17 9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

Icon.displayName = 'ChevronDownIcon'

export const ChevronDownIcon = memo(themed(Icon))
