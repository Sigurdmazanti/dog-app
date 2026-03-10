import { memo, useCallback, useEffect, useState } from "react"
import { Keyboard, Pressable, useColorScheme } from "react-native"
import { H3, ListItem, Sheet, useTheme, View, XStack, YGroup, YStack } from "tamagui"
import { LoadingOverlay } from "../LoadingOverlay"
import { InputWithIcon } from "src/components/input/InputWithIcon"
import { PrimaryButton } from "src/styled/button/PrimaryButton"
import { useDebouncedFetch } from "src/functions/helpers/debouncedFetch"
import { BodyText } from "src/styled/text/BodyText"
import { ChevronRightIcon } from "src/assets/icons/ChevronRight"
import { CustomInput } from "src/styled/input/CustomInput"
import { SearchIcon } from "src/assets/icons/Search"
import { CustomH3 } from "src/styled/headings/CustomH3"
import { BorderedInput } from "../input/BorderedInput"

type FetchItems<T> = (query: string, page: number, pageSize: number) => Promise<{ items: T[]; total: number }>

type SearchableSelectListProps<T> = {
  pageSize: number
  searchPlaceholder: string
  loadMoreButtonText: string
  fetchItems: FetchItems<T>
  noResultsText?: string
  title?: string
  setOpen?: (val: boolean) => void
  onSelect?: (val: T) => void
  showTotalCount?: boolean
  showTotalCountSuffix?: string
  getKey: (item: T) => string
  getLabel: (item: T) => string
  onFetchResult?: (shown: number, total: number) => void
}

type SelectListProps<T> = {
  query: string
  pageSize: number
  loadMoreButtonText: string
  fetchItems: FetchItems<T>
  noResultsText?: string
  onSelect?: (value: T) => void
  showTotalCount: boolean
  showTotalCountSuffix: string
  getKey: (item: T) => string
  getLabel: (item: T) => string
  onFetchResult?: (shown: number, total: number) => void
}

export function SearchableSelectList<T>({
  pageSize,
  searchPlaceholder,
  loadMoreButtonText,
  showTotalCount = false,
  showTotalCountSuffix = 'results',
  fetchItems,
  noResultsText,
  title,
  setOpen,
  onSelect,
  getKey,
  getLabel,
  onFetchResult,
}: SearchableSelectListProps<T>) {
  const [query, setQuery] = useState('')

  return (
    <YStack width="100%" flex={1} items="center" gap="$4">
      {title && 
        <CustomH3 mx="auto">{title}</CustomH3>
      }

      <BorderedInput
        borderWidth={0}
        flex={1}
        value={query}
        onChangeText={setQuery}
        placeholder={searchPlaceholder}
        icon={<SearchIcon strokeWidth={1.75} size='$1' color="$primaryText" />}
      />

      <SelectList<T>
        query={query}
        pageSize={pageSize}
        loadMoreButtonText={loadMoreButtonText}
        fetchItems={fetchItems}
        noResultsText={noResultsText}
        onSelect={onSelect}
        getKey={getKey}
        getLabel={getLabel}
        onFetchResult={onFetchResult}
        showTotalCount={showTotalCount}
        showTotalCountSuffix={showTotalCountSuffix}
      />
    </YStack>
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
  onFetchResult,
  showTotalCount,
  showTotalCountSuffix,
}: SelectListProps<T>) {
  const [selected, setSelected] = useState<T | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const wrappedFetch = useCallback(async (q: string, p: number, s: number) => {
    const result = await fetchItems(q, p, s)
    setTotal(result.total)
    return result.items
  }, [fetchItems])

  const { items, hasMore, loading, debouncedFetch } = useDebouncedFetch<T>(wrappedFetch, pageSize)

  useEffect(() => {
    setPage(1)
    debouncedFetch(query, 1)
    return () => debouncedFetch.cancel()
  }, [query, debouncedFetch])

  useEffect(() => {
    if (onFetchResult) {
      onFetchResult(items.length, total)
    }
  }, [items, total])

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
            {items.length > 0 ? items.map(item => (
              <YGroup.Item key={getKey(item)}>
                <ListItem
                  pressTheme
                  hoverTheme
                  title={getLabel(item)}
                  iconAfter={<ChevronRightIcon size='$1' strokeWidth={1.2} color="$primaryText" />}
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

        <YStack gap="$2" items="center">
          {hasMore &&
            <PrimaryButton
              maxW={150}
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
          {showTotalCount && total > 0 && (
            <BodyText text="center">
              {`Showing ${items.length} of ${total} ${showTotalCountSuffix}`}
            </BodyText>
          )}
        </YStack>
      </View>
    </>
  )
}
