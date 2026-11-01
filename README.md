# StorVault Client

This repository contains the React frontend for StorVault, a cloud file-storage and sharing application. It provides the user-facing experience for account access, file management, previews, plans, and admin workflows that connect to the StorVault backend API.

## Features

- Authentication for sign up, login, OTP verification, and Google sign-in
- File and folder browsing with nested directory navigation
- Upload, preview, rename, and delete flows for files and folders
- Public file sharing and shared-with-me views
- Storage usage and quota visibility in the dashboard
- Plan selection and Razorpay-based subscription checkout
- Admin user management screens for role-based access

## Tech Stack

- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Google OAuth client integration
- Razorpay checkout integration

## Backend

This frontend connects to the StorVault backend API for authentication, file storage, session handling, AWS S3/CloudFront access, RBAC, payments, and deployment workflows.

Backend repository: TBD (add the GitHub URL when published)

The backend README is the primary source for the deeper implementation details, including:

- authentication and session architecture
- AWS S3 and CloudFront storage flow
- API design and route structure
- Redis and database usage
- RBAC and admin authorization
- subscription and payment processing
- deployment configuration

## Local Development

```bash
cd client
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

Optional preview:

```bash
npm run preview
```

## Environment Variables

The client reads the following environment variable names from the frontend environment:

```text
VITE_GOOGLE_API_KEY
VITE_GOOGLE_CLIENT_ID
VITE_BACKEND_BASE_URL
```

No secret values are included in this README.

## Live Demo

https://storvault.xyz

## Screenshots

Will be added soon!

---


