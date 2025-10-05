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

type FetchItems = (query: string, page: number, pageSize: number) => Promise<string[]>

type SearchableSelectListProps = {
  pageSize: number
  searchPlaceholder: string
  loadMoreButtonText: string
  fetchItems: FetchItems
  noResultsText?: string
  title?: string
  setOpen?: (val: boolean) => void
  onSelect?: (val: string) => void
}

type SelectListProps = {
  query: string
  pageSize: number
  loadMoreButtonText: string
  fetchItems: FetchItems
  noResultsText?: string
  onSelect?: (value: string) => void
}

export const SearchableSelectList = memo(
  ({ pageSize, searchPlaceholder, loadMoreButtonText, fetchItems, noResultsText, title, setOpen, onSelect }: SearchableSelectListProps) => {
    const [query, setQuery] = useState('')
    const theme = useTheme();
    const colorScheme = useColorScheme() ?? "light";

    return (
      <View width="100%" flex={1} items="center">
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={{ width: '100%' }}
        >
          {title && <HeadingText mx="auto" mb="$4">{title}</HeadingText>}
          <XStack
            items="center"
            rounded="$4"
            borderWidth="$0.5"
            borderColor="$borderColor"
            px="$2"
            mb="$4"
          >
            <SearchIcon strokeWidth={1.75} size={20} color="$primaryText"/>
            <CustomInput
              flex={1}
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
            />
          </XStack>
        </Pressable>

        <SelectList 
          query={query}
          pageSize={pageSize}
          loadMoreButtonText={loadMoreButtonText}
          noResultsText={noResultsText}
          fetchItems={fetchItems}
          onSelect={onSelect}
        />
    </View>
    )
  }
)

export function SelectList({
  query,
  pageSize,
  loadMoreButtonText,
  fetchItems,
  noResultsText,
  onSelect,
}: SelectListProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  
  const {
    items,
    hasMore,
    loading,
    debouncedFetch
  } = useDebouncedFetch(fetchItems, pageSize)

  useEffect(() => {
    setPage(1)
    debouncedFetch(query, 1)
    return () => debouncedFetch.cancel()
  }, [query, debouncedFetch])

  const loadMore = () => {
    if (!hasMore || loading) return
    const nextPage = page + 1
    setPage(nextPage)
    debouncedFetch(query, nextPage)
  }

  return (
    <>
      <View width="100%" position="relative" flex={1}>
        {loading && <LoadingOverlay />}
        <Sheet.ScrollView width="100%" keyboardShouldPersistTaps="handled">
          <YGroup bordered>
            {items.length > 0 ? (
              items.map((item) => (
                <YGroup.Item key={item}>
                  <ListItem
                    pressTheme
                    hoverTheme
                    title={item}
                    iconAfter={<ChevronRightIcon size={20} strokeWidth={1.2} color="$primaryText" />}
                    onPress={() => {
                      setSelected(item)
                      onSelect?.(item)
                      Keyboard.dismiss()
                    }}
                  />
                </YGroup.Item>
              ))
            ) : (
              <YGroup.Item>
                <ListItem justify="center">
                  <BodyText fontWeight="bold">{noResultsText}</BodyText>
                </ListItem>
              </YGroup.Item>
            )}
          </YGroup>
        </Sheet.ScrollView>
      </View>
      {hasMore &&
        <PrimaryButton 
          onPress={() => {
            if (hasMore) {
              loadMore()
            }
          }}
          mt="$4"
        >
          {loadMoreButtonText}
        </PrimaryButton>
      }
    </>
  )
}