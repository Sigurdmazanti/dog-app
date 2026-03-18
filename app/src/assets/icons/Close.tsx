import { Svg, Path, SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'
import { memo } from 'react'

const Icon = (propsBase: IconProps) => {
	const { color = '#000', size = 24, strokeWidth = 1.5, ...otherProps } = propsBase as SvgProps & { size: number }

	return (
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			{...otherProps}
		>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
				fill={color}
			/>
		</Svg>
	)
}

Icon.displayName = 'CloseIcon'

export const CloseIcon = memo(themed(Icon))
