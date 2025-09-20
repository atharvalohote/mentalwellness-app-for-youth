#!/bin/bash

# Android Emulator Auto-Start Script
# This script will start the Android emulator if it's not already running

# Set Android environment variables
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools

# Check if emulator is already running
if pgrep -f "emulator.*Pixel_9_Pro" > /dev/null; then
    echo "Android emulator is already running"
    exit 0
fi

# Check if AVD exists
if ! emulator -list-avds | grep -q "Pixel_9_Pro"; then
    echo "Error: AVD 'Pixel_9_Pro' not found"
    echo "Available AVDs:"
    emulator -list-avds
    exit 1
fi

echo "Starting Android emulator (Pixel_9_Pro)..."
# Start the emulator with visible window
emulator -avd Pixel_9_Pro &

# Wait for emulator to boot
echo "Waiting for emulator to boot..."
sleep 10

# Check if emulator is ready
echo "Checking if emulator is ready..."
adb wait-for-device
echo "Android emulator is ready!"
