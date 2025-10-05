import { Svg, Path, SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'
import { memo } from 'react'

const Icon = (propsBase: IconProps) => {
  const { color, size = 24, strokeWidth = 1.5, ...otherProps } = propsBase as SvgProps & { size: number }

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...otherProps}
    >
      <Path
        d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

Icon.displayName = 'SearchIcon'

export const SearchIcon = memo(themed(Icon))
