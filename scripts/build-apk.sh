#!/bin/bash
set -e

echo "=========================================="
echo "🚀 Building Al-Waqza Store APK & AAB"
echo "=========================================="

export JAVA_HOME=/tmp/jdk21
export PATH=$JAVA_HOME/bin:$PATH

if [ ! -d "/tmp/jdk21/bin" ]; then
  echo "📥 Downloading Temurin JDK 21..."
  mkdir -p /tmp/jdk21
  cd /tmp
  wget -q https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.6%2B7/OpenJDK21U-jdk_x64_linux_hotspot_21.0.6_7.tar.gz
  tar -xzf OpenJDK21U-jdk_x64_linux_hotspot_21.0.6_7.tar.gz -C /tmp/jdk21 --strip-components=1
  rm -f OpenJDK21U-jdk_x64_linux_hotspot_21.0.6_7.tar.gz
  cd /app/applet
fi

echo "Using Java:"
java -version

export ANDROID_HOME=/tmp/android-sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# Setup Android SDK if not present
if [ ! -d "$ANDROID_HOME/cmdline-tools/latest" ]; then
  echo "📥 Downloading Android Commandline Tools..."
  mkdir -p /tmp/cmdline-temp $ANDROID_HOME/cmdline-tools
  cd /tmp/cmdline-temp
  wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
  unzip -q commandlinetools-linux-11076708_latest.zip
  mv cmdline-tools $ANDROID_HOME/cmdline-tools/latest
  rm -rf /tmp/cmdline-temp
fi

echo "📋 Accepting SDK licenses and verifying packages..."
mkdir -p $ANDROID_HOME/licenses
yes | sdkmanager --licenses > /dev/null 2>&1 || true

if [ ! -d "$ANDROID_HOME/platforms/android-34" ]; then
  echo "📦 Installing Android 34 Platform and Build-Tools..."
  sdkmanager "platforms;android-34" "build-tools;34.0.0" "platform-tools" > /dev/null 2>&1
fi

echo "🔄 Syncing Capacitor Android web assets..."
cd /app/applet
npm run build
npx cap sync android

echo "🔑 Ensuring Release Keystore..."
if [ ! -f "android/app/release.keystore" ]; then
  keytool -genkey -v -keystore android/app/release.keystore -alias alwaqza -keyalg RSA -keysize 2048 -validity 10000 -storepass alwaqza2026 -keypass alwaqza2026 -dname "CN=Alwaqza Store, OU=Mobile, O=Alwaqza, L=Sanaa, ST=Sanaa, C=YE"
fi

echo "🔨 Building Release APK..."
chmod +x android/gradlew
cd android
./gradlew assembleRelease --stacktrace

echo "📦 Building Release AAB (Google Play Bundle)..."
./gradlew bundleRelease --stacktrace

cd /app/applet
echo "🚚 Exporting APK and AAB to project root..."
APK_PATH=$(find android/app/build/outputs/apk/release -name "*.apk" | head -n 1)
AAB_PATH=$(find android/app/build/outputs/bundle/release -name "*.aab" | head -n 1)

if [ -f "$APK_PATH" ]; then
  cp "$APK_PATH" /app/applet/app-release.apk
  echo "✅ app-release.apk ready at /app/applet/app-release.apk ($(du -h /app/applet/app-release.apk | cut -f1))"
else
  echo "⚠️ APK path not found"
fi

if [ -f "$AAB_PATH" ]; then
  cp "$AAB_PATH" /app/applet/app-release.aab
  echo "✅ app-release.aab ready at /app/applet/app-release.aab ($(du -h /app/applet/app-release.aab | cut -f1))"
else
  echo "⚠️ AAB path not found"
fi

echo "🎉 Build finished successfully!"
