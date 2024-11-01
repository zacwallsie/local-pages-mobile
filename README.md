# Local Pages Mobile

Local Pages Mobile is a React Native Expo application that allows users to search through companies that provide specific services to specific locations. These companies are created in the Next.js related app which allows companies to showcase their services and the specific areas they service.

## Getting Started

### Installation

1. Extract the provided zip file containing the project files.

2. Navigate to the project directory:

    ```
    cd local-pages-mobile
    ```

3. Install dependencies

    ```bash
    npm install
    ```

4. Start the app

    ```bash
     npx expo start
    ```

    OR

    ```bash
    npm run start
    ```

In the output, you'll find options to open the app in a

-   [development build](https://docs.expo.dev/develop/development-builds/introduction/)
-   [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
-   [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
-   [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

#### Please Note: IOS simulator was primarily used for development.

### Environment Setup

Public Supabase Keys are used throughout the application and as such no `.env.local` file is required as the keys can be actively exposed due to row level security (RLS) being deployed.

## Backend

The backend of this application is developed using Supabase.

## Test Account

A test account has been set up with the following credentials:

-   Username: zacwalls20@gmail.com
-   Password: #Testing123

You can use this account to explore the application's features.

## References

During the development of this project, Claude 3.5, an AI assistant, was used for general brainstorming and docstring generation. This tool helped in conceptualizing various aspects of the application and organizing its structure effectively.
