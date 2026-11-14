import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

export const initMobileApp = async (onBackPress?: () => boolean) => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#070F1E' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (err) {
    console.debug('StatusBar configuration skipped:', err);
  }

  try {
    await SplashScreen.hide();
  } catch (err) {
    console.debug('SplashScreen hide skipped:', err);
  }

  if (onBackPress) {
    CapApp.addListener('backButton', () => {
      const handled = onBackPress();
      if (!handled) {
        CapApp.exitApp();
      }
    });
  }
};
