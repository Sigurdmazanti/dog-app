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
        d="M14.5 7L9.5 12L14.5 17"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

Icon.displayName = 'ChevronLeftIcon'

export const ChevronLeftIcon = memo(themed(Icon))
