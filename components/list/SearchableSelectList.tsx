import { ChevronRight, Star } from "@tamagui/lucide-icons"
import { memo, useEffect, useState } from "react"
import { Keyboard, Pressable } from "react-native"
import { ListItem, Sheet, useTheme, View, YGroup } from "tamagui"
import { LoadingOverlay } from "../LoadingOverlay"
import { HeadingText } from "styled/text/HeadingText"
import { InputWithIcon } from "components/input/InputWithIcon"
import { PrimaryButton } from "styled/button/PrimaryButton"
import { useDebouncedFetch } from "app/functions/helpers/debouncedFetch"
import { BodyText } from "styled/text/BodyText"

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
    
    return (
        <View width="100%" flex={1} items="center">
          <Pressable
            onPress={() => Keyboard.dismiss()}
            style={{ width: '100%' }}
          >
            {title && <HeadingText mx="auto" mb="$4">{title}</HeadingText>}
            <InputWithIcon
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
            />
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
            {items.length > 1 ? (
              items.map((item) => (
                <YGroup.Item key={item}>
                  <ListItem
                    pressTheme
                    hoverTheme
                    title={item}
                    icon={Star}
                    iconAfter={ChevronRight}
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