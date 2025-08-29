import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store/store'
import { Button, Paragraph, Progress, SizeTokens, Slider, XStack, YStack } from 'tamagui'

interface ProgressBarProps {
  totalSteps: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ totalSteps }) => {
  const currentStep = useSelector((state: RootState) => state.dogForm.currentStep)
  const progressPercent = (currentStep / totalSteps) * 100
  const [key, setKey] = React.useState(0)
  const [size, setSize] = React.useState(4)
  const [progress, setProgress] = React.useState(0)
  const sizeProp = `$${size}` as SizeTokens

  useEffect(() => {
    const timer = setTimeout(() => setProgress(60), 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [])
    
  return (
    <>
      <YStack height={60} items="center" gap="$4">
        <Paragraph height={30} opacity={0.5}>
          Size: {size}
        </Paragraph>
        <Progress key={key} size={sizeProp} value={progress}>
          <Progress.Indicator animation="bouncy" />
        </Progress>
      </YStack>

      <XStack
        items="center"
        gap="$2"
        position="absolute"
        b="$3"
        l="$4"
      >
        <Slider
          size="$2"
          width={130}
          defaultValue={[4]}
          min={2}
          max={6}
          step={1}
          onValueChange={([val]) => {
            setSize(val)
          }}
        >
          <Slider.Track borderWidth={1} borderColor="$color5">
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb circular index={0} />
        </Slider>

        <Button size="$2" onPress={() => setProgress((prev) => (prev + 20) % 100)}>
          Load
        </Button>
        <Button
          size="$2"
          onPress={() => {
            setKey(Math.random())
            setProgress(0)
          }}
        >
          Reset
        </Button>
      </XStack>
    </>
  )
}

export default ProgressBar;
