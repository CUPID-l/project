# Soil Sync - Fertilizer Optimization Web App

Soil Sync is a web application that helps farmers optimize their fertilizer usage based on soil parameters and crop requirements. The app uses machine learning to provide personalized fertilizer recommendations.

## Features

- Real-time soil parameter monitoring
- ML-powered fertilizer recommendations
- Historical data visualization
- Multi-crop support
- Mobile-responsive design

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS + Shadcn UI
- Backend: Firebase
- ML Integration: Groq API
- Charts: Chart.js

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Groq API key

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/soil-sync.git
   cd soil-sync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Firebase and Groq API credentials.

5. Start the development server:
   ```bash
npm run dev
```

## Project Structure

```
soil-sync/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Application pages
│   ├── lib/              # Utility functions
│   │   ├── firebase.ts   # Firebase configuration
│   │   ├── ml-service.ts # ML model integration
│   │   └── data-utils.ts # Data processing utilities
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
└── .env                  # Environment variables
```

## Deployment

The application can be deployed to any static hosting service. For Firebase hosting:

```bash
npm run build
firebase deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
