# Auto-Presence

Auto-Presence is an intelligent social media automation platform that leverages AI to generate, schedule, and analyze content across various social media platforms. The system uses machine learning to generate engaging posts, analyze audience engagement, and provide smart insights to improve your social media presence.


## Features

- **AI-Generated Content**: Create compelling images and captions using advanced machine learning models
- **Smart Scheduling**: Automatically schedule posts for optimal engagement times
- **Cross-Platform Support**: Post to multiple social media platforms from one interface
- **Analytics Dashboard**: Track post performance and audience engagement
- **Comment Analysis**: AI-powered analysis of comments to understand audience sentiment
- **Automated Replies**: Smart chatbot for engaging with audience messages
- **Custom Branding**: Maintain consistent brand identity across all generated content

## Project Structure

```
Auto-Presence/
├── backend/             # Python Django backend
│   ├── requirements.txt
│   ├── meta/            # Meta platform integration
│   │   ├── cloudinary_config.py
│   │   ├── schedulePost.py
│   │   └── toPost.py
│   └── socio_connect/   # Main Django app
│
├── frontend/            # Next.js frontend
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── constants/       # App constants
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript type definitions
│
└── models/              # ML models for content generation
    ├── bgImage.py       # Background image generation
    ├── comment_analyser.py  # Comment sentiment analysis
    ├── genAndText.py    # Text generation
    ├── initial_prompt.py
    └── models_assets/   # Asset files for ML models
```

## Getting Started

### Prerequisites

- Node.js 16.x or later
- Python 3.8 or later
- pnpm, npm, or yarn package manager
- Django and Django REST Framework
- Cloudinary account for image storage

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the frontend directory with your API keys:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_INSTAGRAM_ACCOUNT_ID=your_account_id
   NEXT_PUBLIC_ACCESS_TOKEN=your_access_token
   ```

4. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to access the application.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Cloudinary:
   Edit `meta/cloudinary_config.py` with your Cloudinary credentials.

5. Run the Django server:
   ```bash
   cd socio_connect
   python manage.py migrate
   python manage.py runserver
   ```

## Usage

### Creating an Instant Post

1. Navigate to the "Post" tab in the sidebar
2. Toggle "AI Mode" if you want to use AI to generate content
3. Fill in the required fields:
   - Caption (for manual posts)
   - Post vibes (for AI-generated posts)
   - Product name (for AI-generated posts)
   - Select post type (image only or image with text)
4. Click "Create Post" to publish immediately

### Scheduling a Post

1. Navigate to the "Schedule" tab in the sidebar
2. Click "Schedule New Post"
3. Select the date for your post
4. Enter post details:
   - Post vibes
   - Product name
   - Post type
   - Text overlay (optional)
5. Click "Schedule Post"

## Pre-Generated Festival & Occasion Posts

Auto-Presence comes with a unique feature: a gallery of pre-generated posts for popular festivals, occasions, and important days. This helps you stay relevant and never miss an opportunity to engage your audience during:

- National and international festivals (e.g., Diwali, Christmas, Eid, New Year)
- Important days (e.g., Independence Day, Women's Day, Earth Day)
- Brand-specific or regional celebrations

### Viewing Analytics

1. Navigate to the "Analytics" tab to view post performance metrics
2. Check engagement statistics and comment sentiment analysis

## AI Models

Auto-Presence uses several AI models to generate content:

- **Text Generation**: Powered by Mixtral 8x7B model via Groq
- **Image Generation**: Custom image generation model
- **Comment Analysis**: Sentiment analysis model to categorize comments



### How It Works
- Browse or search the pre-generated post templates for upcoming occasions.
- Instantly use or customize these posts with your branding, captions, or images.
- Schedule them in advance so your social media stays active and festive, even if you’re busy.

This feature ensures your brand is always part of trending conversations and celebrations, boosting engagement and relevance with minimal effort.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.


## Contact

For any questions or suggestions regarding Auto-Presence, please contact us at ashishpandey2062@gmail.com.
