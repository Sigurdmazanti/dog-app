import { memo, useEffect, useState } from "react"
import { Keyboard, Pressable, useColorScheme } from "react-native"
import { ListItem, Sheet, useTheme, View, XStack, YGroup } from "tamagui"
import { BodyText } from "src/styled/text/BodyText"
import { ChevronRightIcon } from "src/assets/icons/ChevronRight"

interface SelectListItem {
  value: string | number
  label: string
}

interface SelectListProps {
  items: SelectListItem[]
  noResultsText?: string
  onSelect?: (item: SelectListItem) => void
}

export function SelectLista({
  items = [],
  noResultsText = "No results",
  onSelect,
}: SelectListProps) {
  const [selected, setSelected] = useState<SelectListItem | null>(null)

  return (
		<View width="100%">
			<YGroup bordered>
				{items.length > 0 ? items.map(item => (
					<YGroup.Item key={item.value}>
						<ListItem
							pressTheme
							hoverTheme
							title={item.label}
							iconAfter={<ChevronRightIcon size='$1' strokeWidth={1.2} color="$primaryText" />}
							onPress={() => {
								setSelected(item)
								onSelect?.(item)
								Keyboard.dismiss()
							}}
						/>
					</YGroup.Item>
				)) : noResultsText && (
					<YGroup.Item>
						<ListItem justify="center">
							<BodyText fontWeight="bold">{noResultsText}</BodyText>
						</ListItem>
					</YGroup.Item>
				)}
			</YGroup>
		</View>
  )
}
