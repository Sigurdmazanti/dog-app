import { memo, useEffect, useState } from "react"
import { Keyboard, Pressable, useColorScheme } from "react-native"
import { ListItem, Sheet, useTheme, View, XStack, YGroup } from "tamagui"
import { LoadingOverlay } from "../LoadingOverlay"
import { HeadingText } from "src/styled/text/HeadingText"
import { InputWithIcon } from "src/components/input/InputWithIcon"
import { PrimaryButton } from "src/styled/button/PrimaryButton"
import { useDebouncedFetch } from "src/functions/helpers/debouncedFetch"
import { BodyText } from "src/styled/text/BodyText"
import { ChevronRightIcon } from "src/assets/icons/ChevronRight"
import { CustomInput } from "src/styled/input/Input"
import { SearchIcon } from "src/assets/icons/Search"

type FetchItems<T> = (query: string, page: number, pageSize: number) => Promise<T[]>

type SearchableSelectListProps<T> = {
  pageSize: number
  searchPlaceholder: string
  loadMoreButtonText: string
  fetchItems: FetchItems<T>
  noResultsText?: string
  title?: string
  setOpen?: (val: boolean) => void
  onSelect?: (val: T) => void
  getKey: (item: T) => string
  getLabel: (item: T) => string
}

type SelectListProps<T> = {
  query: string
  pageSize: number
  loadMoreButtonText: string
  fetchItems: FetchItems<T>
  noResultsText?: string
  onSelect?: (value: T) => void
  getKey: (item: T) => string
  getLabel: (item: T) => string
}

export function SearchableSelectList<T>({
  pageSize,
  searchPlaceholder,
  loadMoreButtonText,
  fetchItems,
  noResultsText,
  title,
  setOpen,
  onSelect,
  getKey,
  getLabel,
}: SearchableSelectListProps<T>) {

  const [query, setQuery] = useState('')

  return (
    <View width="100%" flex={1} items="center">
      {title && <HeadingText mx="auto" mb="$4">{title}</HeadingText>}

      <XStack
        items="center"
        rounded="$4"
        borderWidth="$0.5"
        borderColor="$borderColor"
        px="$2"
        mb="$4"
      >
        <SearchIcon strokeWidth={1.75} size={20} color="$primaryText" />
        <CustomInput
          flex={1}
          value={query}
          onChangeText={setQuery}
          placeholder={searchPlaceholder}
        />
      </XStack>

      <SelectList<T>
        query={query}
        pageSize={pageSize}
        loadMoreButtonText={loadMoreButtonText}
        fetchItems={fetchItems}
        noResultsText={noResultsText}
        onSelect={onSelect}
        getKey={getKey}
        getLabel={getLabel}
      />
    </View>
  )
}

export function SelectList<T>({
  query,
  pageSize,
  loadMoreButtonText,
  fetchItems,
  noResultsText,
  onSelect,
  getKey,
  getLabel,
}: SelectListProps<T>) {

  const [selected, setSelected] = useState<T | null>(null)
  const [page, setPage] = useState(1)

  const { items, hasMore, loading, debouncedFetch } =
    useDebouncedFetch<T>(fetchItems, pageSize)

  useEffect(() => {
    setPage(1)
    debouncedFetch(query, 1)
    return () => debouncedFetch.cancel()
  }, [query, debouncedFetch])

  return (
    <>
      <View width="100%" position="relative" flex={1}>
        {loading && <LoadingOverlay />}

        <Sheet.ScrollView width="100%" keyboardShouldPersistTaps="handled">
          <YGroup bordered>

            {items.length > 0 ? items.map(item => (
              <YGroup.Item key={getKey(item)}>
                <ListItem
                  pressTheme
                  hoverTheme
                  title={getLabel(item)}
                  iconAfter={<ChevronRightIcon size={20} strokeWidth={1.2} color="$primaryText" />}
                  onPress={() => {
                    setSelected(item)
                    onSelect?.(item)
                    Keyboard.dismiss()
                  }}
                />
              </YGroup.Item>
            )) : (
              <YGroup.Item>
                <ListItem justify="center">
                  <BodyText fontWeight="bold">{noResultsText}</BodyText>
                </ListItem>
              </YGroup.Item>
            )}

          </YGroup>
        </Sheet.ScrollView>
      </View>
    </>
  )
}
