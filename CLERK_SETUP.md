# Clerk Authentication Setup Instructions

## Step 1: Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

## Step 2: Get Your Publishable Key

1. In your Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in the root of your project
2. Replace `your_clerk_publishable_key_here` with your actual Clerk Publishable Key:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

## Step 4: Configure Clerk Settings (Optional)

In your Clerk Dashboard, you can customize:

- **Sign-in/Sign-up methods**: Email, Google, GitHub, etc.
- **Appearance**: Match your app's theme
- **Email templates**: Customize verification emails
- **User profile fields**: Add custom fields

### Recommended Settings:

1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable **Email address** as a sign-in option
3. Enable **Username** (optional)

## Step 5: Start the Application

```bash
npm run dev
```

## How It Works

### Public Routes (No Authentication Required)
- `/sign-in` - Login page
- `/sign-up` - Registration page

### Protected Routes (Authentication Required)
- `/` - Document Audit page
- `/assistant` - Live Assistant page

If a user tries to access a protected route without being logged in, they will be automatically redirected to the sign-in page.

### Features

- **Landing Page**: Shows information about PolicyProof with sign-in/sign-up forms
- **Protected Routes**: All main application pages require authentication
- **User Profile**: Shows user info in the sidebar with sign-out button
- **Automatic Redirects**: After login, users are redirected to the Document Audit page

## Testing

1. Click "Sign Up" and create a test account
2. You'll be automatically logged in and redirected to the Document Audit page
3. Try accessing `/assistant` - you should have access
4. Click the logout button in the sidebar
5. Try accessing `/` or `/assistant` - you'll be redirected to sign-in

## Customization

### Styling the Auth Forms

You can customize the Clerk components appearance in `src/pages/Landing.tsx`:

```tsx
<SignIn
  appearance={{
    elements: {
      rootBox: "w-full",
      card: "shadow-lg",
      // Add more custom styles here
    },
  }}
/>
```

### Adding More OAuth Providers

1. In Clerk Dashboard, go to **User & Authentication** → **Social Connections**
2. Enable providers like Google, GitHub, Microsoft, etc.
3. They will automatically appear in your sign-in/sign-up forms
