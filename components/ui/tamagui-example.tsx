import { Button, H1, Paragraph, XStack, YStack } from 'tamagui';

/**
 * Пример использования компонентов Tamagui
 * Священный образец работы с UI-машиной
 */
export function TamaguiExample() {
  return (
    <YStack padding="$4" gap="$4" backgroundColor="$background">
      <H1>Таможня Tamagui активирована!</H1>
      <Paragraph theme="alt2">
        Механикус благословляет ваш UI. Все системы работают в оптимальном режиме.
      </Paragraph>
      
      <XStack gap="$3">
        <Button theme="blue" size="$4">
          Первичная кнопка
        </Button>
        <Button theme="green" size="$4" chromeless>
          Вторичная кнопка
        </Button>
      </XStack>

      <YStack padding="$3" backgroundColor="$backgroundHover" borderRadius="$4">
        <Paragraph>
          Теперь ты можешь использовать мощные компоненты Tamagui:
          {'\n'}- Button, Input, Card
          {'\n'}- H1, H2, Paragraph, Text
          {'\n'}- XStack, YStack, ZStack
          {'\n'}- и многие другие!
        </Paragraph>
      </YStack>
    </YStack>
  );
}
