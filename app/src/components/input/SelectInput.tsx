import { useMemo, useState } from "react"
import { ChevronDownIcon } from "src/assets/icons/ChevronDown"
import { CustomSelectTrigger } from "src/styled/input/CustomSelectTrigger"
import { Adapt, Select, SelectProps, Sheet, View, YStack } from "tamagui"

export type SelectItem<T extends string> = {
  value: T
  label: string
}

export interface SelectInputProps<T extends string> {
	items: SelectItem<T>[]
	groupHeader: string
	snapPoints?: number[]
	value?: T
  onChange?: (value: T) => void
}

export function SelectInput<T extends string>({ 
	items,
	groupHeader,
	snapPoints = [50, 100],
	value,
  onChange
}: SelectInputProps<T>) {

  return (
    <View>
      <Select
        value={value}
        onValueChange={(v) => onChange?.(v as T)}
        disablePreventBodyScroll
      >
        <CustomSelectTrigger
          iconAfter={<ChevronDownIcon />}
        >
          <Select.Value placeholder="Select..." />
        </CustomSelectTrigger>

        <Adapt when="maxXl" platform="touch">
          <Sheet modal dismissOnSnapToBottom snapPoints={snapPoints}>
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              bg='$backdrop'
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.Viewport
            rounded="$4"
            borderWidth="$0.5"
            borderColor="red"
          >
            <Select.Group>
              <Select.Label>{groupHeader}</Select.Label>
              {/* for longer lists memoizing these is useful */}
              {useMemo(
                () =>
                  items.map((item, i) => {
                    return (
                      <Select.Item
                        index={i}
                        key={item.label}
                        value={item.value}
                      >
                        <Select.ItemText>{item.label}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                        </Select.ItemIndicator>
                      </Select.Item>
                    )
                  }),
                [items]
              )}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select>
    </View>
  )
}