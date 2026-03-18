import { useState } from "react"
import { Sheet, Button } from "tamagui"

type CustomSheetProps = {
  open: boolean
  setOpen: (val: boolean) => void
  children: (setOpen: (val: boolean) => void) => React.ReactNode
}

export const CustomSheet = ({ open, setOpen, children }: CustomSheetProps) => {
  const [position, setPosition] = useState(0)

  return (
    <Sheet
      modal
      animation="medium"
      open={open}
      onOpenChange={setOpen}
      position={position}
      onPositionChange={setPosition}
      dismissOnSnapToBottom
      forceRemoveScrollEnabled={open}
    >
      <Sheet.Overlay
        animation="quick"
        bg="$backdrop"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame px="$4" pb="$12" pt="$8" justify="center" items="center">
        {children(setOpen)}
      </Sheet.Frame>
    </Sheet>
  )
}