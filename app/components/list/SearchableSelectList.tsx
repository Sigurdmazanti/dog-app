import { ChevronRight, Dog, Star } from "@tamagui/lucide-icons"
import { memo, useCallback, useEffect, useState } from "react"
import { Keyboard, Pressable } from "react-native"
import { Button, debounce, Input, ListItem, Sheet, View, XStack, YGroup } from "tamagui"
import { LoadingOverlay } from "../LoadingOverlay"
import { HeadingText } from "../text/HeadingText"

type SearchableSelectListProps = {
  pageSize: number,
  searchPlaceholder: string,
  loadMoreButtonText: string,
  title?: string
  setOpen?: (val: boolean) => void
}

export const SearchableSelectList = memo(
  ({ pageSize, searchPlaceholder, loadMoreButtonText, title, setOpen }: SearchableSelectListProps) => {
    const [query, setQuery] = useState('')
    
    return (
        <View width="100%" flex={1} items="center">
          <Pressable
            onPress={() => Keyboard.dismiss()}
            style={{ width: '100%' }}
          >
            {title && <HeadingText mx="auto" mb="$4">{title}</HeadingText>}
            <XStack
              items="center"
            >
              <Dog strokeWidth={1.75} size={20} />
              <Input
                flex={1}
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                borderWidth={0}
                rounded="$4"
              />
            </XStack>
          </Pressable>

          <SelectList 
            query={query}
            pageSize={pageSize}
            loadMoreButtonText={loadMoreButtonText}
          />
      </View>
    )
  }
)

export function SelectList({
  query,
  pageSize,
  loadMoreButtonText,
  onSelect,
}: {
  query: string
  pageSize: number,
  loadMoreButtonText: string,
  onSelect?: (value: string) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const simulateFetch = (search: string, pageNum: number) => {
    const filtered = allItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
    const start = (pageNum - 1) * pageSize
    const paginated = filtered.slice(start, start + pageSize)
    const more = start + pageSize < filtered.length
    return { items: paginated, hasMore: more }
  }

  const fetchItems = useCallback(
    debounce((search: string, pageNum: number) => {
      const result = simulateFetch(search, pageNum)
      setItems(pageNum === 1 ? result.items : (prev) => [...prev, ...result.items])
      setHasMore(result.hasMore)
      setLoading(false)
    }, 300),
    []
  )

  useEffect(() => {
    setPage(1)
    setLoading(true)
    fetchItems(query, 1)
    return () => fetchItems.cancel()
  }, [query, fetchItems])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    setLoading(true)
    fetchItems(query, next)
  }

  return (
    <>
      <View width="100%" position="relative" flex={1}>
        {loading && <LoadingOverlay />}
        <Sheet.ScrollView width="100%" mb="$4" keyboardShouldPersistTaps="handled">
          <YGroup bordered>
            {items.map((item) => (
              <YGroup.Item key={item.name}>
                <ListItem
                  pressTheme
                  hoverTheme
                  title={item.name}
                  icon={Star}
                  iconAfter={ChevronRight}
                  onPress={() => {
                    setSelected(item.name)
                    onSelect?.(item.name)
                    Keyboard.dismiss()
                  }}
                />
              </YGroup.Item>
            ))}
          </YGroup>
        </Sheet.ScrollView>
      </View>
      {hasMore && (
        <Button onPress={loadMore}>{loadMoreButtonText}</Button>
      )}
    </>
  )
}

const allItems = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
  { name: 'Apricot' },
  { name: 'Melon' },
  { name: 'Honeydew' },
  { name: 'Starfruit' },
  { name: 'Blueberry' },
  { name: 'Raspberry' },
  { name: 'Strawberry' },
  { name: 'Mango' },
  { name: 'Pineapple' },
  { name: 'Lime' },
  { name: 'Lemon' },
  { name: 'Coconut' },
  { name: 'Guava' },
  { name: 'Papaya' },
  { name: 'Orange' },
  { name: 'Grape' },
  { name: 'Jackfruit' },
  { name: 'Durian' },
  { name: 'dog1' },
  { name: 'dog2' },
  { name: 'dog3' },
  { name: 'dog4' },
  { name: 'dog5' },
  { name: 'dog6' },
  { name: 'dog7' },
  { name: 'dog8' },
]