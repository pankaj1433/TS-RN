# Tatasky Broadband React Native App

## Content
- [Prerequisites](#presrequisites)
- [Installation](#installation)
- [Getting started](#getting-started)
- [Publishing](#publishing)
- [Known Issues](#known-issues)

## Prerequisites

- Node
- Expo
- XCode
- Android Studio
- React Native Cli
- Create React Native Cli
- Cocoapods

## Installation

- Clone the repo using 
```
git clone git@gitlab.intelligrape.net:tsbb/TSBBMobile.git
```
- Install the Node Dependencies:
```
npm install
```
- Install Pods
```
cd ios && pod install
```
- Serve the JavaScript build through Expo XDE or run
    - For Android
    ```
    exp run:android
    ```
    - For iOS
    ```
    exp run:ios
    ```

## Publishing

Run the command to set the API host and Release Channel for expo JS bundle.
```
npm run publish:<environment>
```
Available environment:
- development
- uat
- production

### Android
- Open Android Studio and Generate signed APK
- Do not forget to change the buildType before generating for managing build for different environment
- Available buildType:
    - releaseDevelopment
    - releaseUAT
    - release - For Production
- For generating signed APK follow the steps in the link below
https://developer.android.com/studio/publish/app-signing.html

## Known Issues

- For iOS build

```
    <React/*.h> module not defined
```
Replace the "<React*.h>" type headers to "*h"

- Error while installing Boost via Pod Install
    Execute the following command in your terminal

```
    echo insecure >> ~/.curlrc
```