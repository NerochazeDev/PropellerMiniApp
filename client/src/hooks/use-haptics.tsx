import { useTelegram } from "@/hooks/use-telegram";

export function useHaptics() {
  const { webApp } = useTelegram();

  const triggerHaptic = (type: 'impact' | 'notification' | 'selection' = 'impact', style?: 'light' | 'medium' | 'heavy') => {
    try {
      if (webApp?.HapticFeedback) {
        switch (type) {
          case 'impact':
            webApp.HapticFeedback.impactOccurred(style || 'medium');
            break;
          case 'notification':
            webApp.HapticFeedback.notificationOccurred('success');
            break;
          case 'selection':
            webApp.HapticFeedback.selectionChanged();
            break;
        }
      }
    } catch (error) {
      // Haptic feedback not available
      console.log('Haptic feedback not available');
    }
  };

  const successHaptic = () => triggerHaptic('notification');
  const tapHaptic = () => triggerHaptic('impact', 'light');
  const buttonHaptic = () => triggerHaptic('impact', 'medium');
  const rewardHaptic = () => {
    // Triple haptic for reward
    triggerHaptic('impact', 'heavy');
    setTimeout(() => triggerHaptic('impact', 'medium'), 100);
    setTimeout(() => triggerHaptic('notification'), 200);
  };

  return {
    triggerHaptic,
    successHaptic,
    tapHaptic,
    buttonHaptic,
    rewardHaptic
  };
}