# Green Sea Foods Backend API

Backend API for the Green Sea Foods e-commerce platform, built with Node.js, Express, and MongoDB.

## Getting Started

### Prerequisites

- Node.js (14.x or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update with your configuration
4. Run the development server:
   ```bash
   npm run dev
   ```

## Email Configuration for Password Reset

The application supports multiple email service providers for sending password reset OTPs. You can configure this in the `.env` file:

### Option 1: Ethereal Email (Development/Testing)

This is the default option and requires no configuration. The system will automatically create a temporary Ethereal email account and show you a preview URL in the console.

```
SMTP_SERVICE=ethereal
```

When an OTP is sent, you'll see a URL in the console logs that you can open to view the email.

### Option 2: Mailtrap (Development/Testing)

[Mailtrap](https://mailtrap.io/) is a testing service that captures all outgoing emails in a virtual inbox. It's great for testing without sending real emails.

1. Sign up for a free Mailtrap account
2. Get your inbox credentials
3. Configure your `.env` file:

```
SMTP_SERVICE=mailtrap
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
```

### Option 3: Gmail SMTP (Production)

To use Gmail for sending actual emails:

1. Create or use an existing Gmail account
2. [Set up an App Password](https://support.google.com/accounts/answer/185833?hl=en) (if 2FA is enabled)
3. Configure your `.env` file:

```
SMTP_SERVICE=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Green Sea Foods <your.email@gmail.com>
```

### Option 4: Other SMTP Providers

You can use any SMTP provider (SendGrid, Mailgun, etc.) by configuring the appropriate SMTP settings:

```
SMTP_SERVICE=smtp
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_username
EMAIL_PASS=your_password
EMAIL_FROM=Green Sea Foods <notifications@yourcompany.com>
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get token
- `POST /api/users/forgot-password` - Request password reset OTP
- `POST /api/users/verify-otp` - Verify password reset OTP
- `POST /api/users/reset-password` - Reset password using OTP 