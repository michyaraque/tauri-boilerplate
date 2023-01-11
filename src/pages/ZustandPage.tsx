import { useAsteroidStore } from '@/stores/useAsteroidStore';
import { Text, Button, HStack, VStack } from '@chakra-ui/react'
import React from 'react'

const ZustandPage = () => {

  const {
    asteroids,
    increaseAsteroids,
    decreaseAsteroids,
    removeAllAsteroids
  } = useAsteroidStore();

  return (
    <VStack>
      <Text>Asteroids: {asteroids}</Text>

      <HStack>
        <Button onClick={() => increaseAsteroids()}>Add asteroid</Button>
        <Button onClick={() => decreaseAsteroids()}>Remove asteroid</Button>
      </HStack>
      <Button onClick={() => removeAllAsteroids()}>Remove all Asteroids</Button>
    </VStack>
  )
}

export default ZustandPage;
