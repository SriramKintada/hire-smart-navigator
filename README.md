# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a7afa7d0-9e99-4f26-8cef-5dfd0246e4b0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a7afa7d0-9e99-4f26-8cef-5dfd0246e4b0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a7afa7d0-9e99-4f26-8cef-5dfd0246e4b0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Hire Smart Navigator

A smart hiring platform that helps match candidates with job descriptions using AI.

## Setup Instructions

### Backend Setup

1. Create a Python virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the Flask server:

```bash
python app.py
```

4. Install ngrok:

- Download from https://ngrok.com/download
- Sign up for a free account
- Get your authtoken from the dashboard

5. Start ngrok:

```bash
ngrok http 5000
```

6. Copy the ngrok URL (e.g., https://xxxx-xx-xx-xxx-xx.ngrok.io) and update it in the frontend:

- Open `src/services/resumeMatchService.ts`
- Replace the `baseUrl` with your ngrok URL

### Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

## Usage

1. Open the application in your browser
2. Go to the talent search feature
3. Enter a job description
4. Upload an Excel file with candidate data
5. The system will process the data and show matching candidates

## Excel File Format

The Excel file should contain the following columns:

- Name
- Top Skills (comma-separated)
- Other columns are optional

## Notes

- The backend uses DistilBERT for semantic matching
- The frontend uses React with TypeScript
- CORS is enabled for local development
- The ngrok URL needs to be updated whenever you restart ngrok
