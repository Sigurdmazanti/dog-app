import { Svg, Path, SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'
import { memo } from 'react'

const Icon = (propsBase: IconProps) => {
  const { color, size = 26, strokeWidth = 1.5, ...otherProps } = propsBase as SvgProps & { size: number }

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...otherProps}
    >
      <Path
        d="M9.5 7L14.5 12L9.5 17"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

Icon.displayName = 'ChevronRightIcon'

export const ChevronRightIcon = memo(themed(Icon))
