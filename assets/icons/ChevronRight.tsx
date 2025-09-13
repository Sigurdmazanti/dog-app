import Svg, { Rect, Path } from 'react-native-svg'

export const ChevronRightIcon = ({ size = 26, color = '#000', strokeWidth = 1 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M9.5 7L14.5 12L9.5 17"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </Svg>
)
