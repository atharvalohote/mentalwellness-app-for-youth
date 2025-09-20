#!/bin/bash

# Expo with Auto Emulator Script
# This script starts Expo and automatically launches the emulator when 'a' is pressed

# Set Android environment variables
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools

echo "🚀 Starting Expo with Auto Emulator Support"
echo "📱 Press 'a' to automatically start Android emulator"
echo "🔧 Environment variables set for Android development"
echo ""

# Function to start emulator
start_emulator() {
    echo "🤖 Starting Android emulator..."
    ./start-android-emulator.sh
}

# Start Expo in the background
expo start &
EXPO_PID=$!

# Function to handle cleanup
cleanup() {
    echo "🛑 Stopping Expo..."
    kill $EXPO_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Monitor for 'a' key press
echo "⏳ Waiting for 'a' key press to start emulator..."
while true; do
    read -n 1 -s key
    if [[ $key == "a" || $key == "A" ]]; then
        start_emulator
        echo "✅ Emulator started! You can now press 'a' in the Expo terminal to run on Android."
        break
    fi
done

# Wait for Expo to finish
wait $EXPO_PID
