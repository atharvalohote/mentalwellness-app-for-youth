# Android Development Setup

This project is configured for easy Android development with automatic emulator support.

## Quick Start

### Option 1: Use the integrated script (Recommended)
```bash
./expo-with-emulator.sh
```
Then press 'a' when prompted to start the emulator.

### Option 2: Use npm scripts
```bash
# Start emulator only
npm run emulator

# Start emulator and then Expo
npm run android-with-emulator
```

### Option 3: Manual setup
```bash
# Start emulator manually
./start-android-emulator.sh

# In another terminal, start Expo
npm start
# Then press 'a' in the Expo terminal
```

## Environment Setup

The following environment variables are automatically set:
- `ANDROID_HOME=~/Library/Android/sdk`
- `PATH` includes Android emulator and platform-tools

These are also added to your `~/.zshrc` for permanent setup.

## Available AVDs

Current AVD: `Pixel_9_Pro`

To see all available AVDs:
```bash
emulator -list-avds
```

## Troubleshooting

### Emulator not visible/running in background
If the emulator is running but you can't see it, it might be running in headless mode:
1. Kill the current emulator: `adb -s emulator-5554 emu kill`
2. Restart with visible window: `./start-android-emulator.sh`

### Emulator not starting
1. Make sure Android Studio is installed
2. Check that the AVD exists: `emulator -list-avds`
3. Verify environment variables: `echo $ANDROID_HOME`

### Expo not detecting emulator
1. Check if emulator is running: `adb devices`
2. Restart the emulator: `./start-android-emulator.sh`
3. Restart Expo: `npm start`

### Permission issues
Make sure scripts are executable:
```bash
chmod +x start-android-emulator.sh
chmod +x expo-with-emulator.sh
```
