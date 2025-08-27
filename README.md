# Open Source AI Personality Quiz 🧠✨

> Discover your true self through comprehensive AI-driven personality analysis and insights

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)

## 🎯 Overview

**Open Source AI Personality Quiz** is a modern, AI-powered personality assessment platform that helps users discover their authentic selves through scientifically-informed personality analysis. Using advanced AI technology, the platform analyzes user responses to provide deep insights into personality traits, emotional intelligence, cognitive patterns, and personal growth opportunities.

### ✨ Key Features

- 🔍 **Comprehensive Assessment System**: Multi-dimensional personality evaluation covering traits, values, and cognitive styles
- 🤖 **AI-Powered Analysis**: Advanced OpenAI integration for detailed, personalized insights
- 📊 **Visual Intelligence Profiles**: Interactive charts and visualizations of cognitive strengths
- 📈 **Growth Tracking**: Personal development activities and progress monitoring
- 🎨 **Beautiful UI/UX**: Modern, accessible design with smooth animations
- 📱 **Fully Responsive**: Seamless experience across desktop, tablet, and mobile
- 🔐 **Secure Authentication**: User accounts with secure data handling
- 🌙 **Dark/Light Mode**: Customizable theme preferences
- 📤 **Shareable Reports**: Export and share personality insights

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first styling with custom design system
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Recharts** - Data visualization and charts
- **Sonner** - Toast notifications

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Edge Functions, Storage)
- **PostgreSQL** - Robust relational database
- **OpenAI API** - AI-powered personality analysis
- **Stripe** - Payment processing for premium features

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Browserslist** - Browser compatibility

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase account** (free tier available)
- **OpenAI API key** (for AI analysis features)
- **Stripe account** (for payment features, optional)

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/opensource-ai-personality-quiz.git
   cd opensource-ai-personality-quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Get your project credentials from the Supabase dashboard
   
   c. Create a `.env` file in the root directory:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

4. **Configure Supabase**
   
   The project includes database migrations in the `supabase/` directory. To set up the database:
   
   - Install the Supabase CLI: `npm install -g supabase`
   - Link your project: `supabase link --project-ref your_project_id`
   - Run migrations: `supabase db push`

5. **Set up Edge Function Secrets**
   
   In your Supabase dashboard, go to Settings > Edge Functions and add:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (if using payments)

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, inputs, etc.)
│   ├── assessment/      # Assessment-related components
│   ├── auth/            # Authentication components
│   ├── home/            # Homepage components
│   ├── profile/         # User profile components
│   ├── report/          # Analysis report components
│   └── layout/          # Layout and navigation
├── contexts/            # React contexts (Auth, Theme)
├── features/            # Feature-specific modules
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
├── pages/               # Page components
├── styles/              # CSS and styling files
├── utils/               # Utility functions and helpers
└── types/               # TypeScript type definitions

supabase/
├── functions/           # Edge functions for AI analysis
│   ├── analyze-responses/
│   ├── analyze-concise-responses/
│   └── generate-activity/
└── config.toml         # Supabase configuration
```

## 🔑 Environment Configuration

Create a `.env` file with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Edge Function Secrets (Set in Supabase Dashboard)

```bash
# Required for AI analysis
OPENAI_API_KEY=your_openai_api_key

# Required for payments (optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_API_KEY=your_stripe_publishable_key

# Supabase internal (auto-configured)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- `profiles` - User profile information
- `assessments` - Assessment responses
- `analyses` - AI-generated personality analyses
- `concise_analyses` - Quick assessment results
- `activities` - Personal growth activities
- `assessment_credits` - User credit system

All tables include Row Level Security (RLS) policies for data protection.

## 🚀 Deployment

### Using Supabase (Recommended)

1. **Push your database schema**
   ```bash
   supabase db push
   ```

2. **Deploy edge functions**
   ```bash
   supabase functions deploy
   ```

3. **Build and deploy frontend**
   
   The app can be deployed to any modern hosting provider:
   - Vercel
   - Netlify  
   - Railway
   - Render
   - AWS Amplify

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy the 'dist' folder to your hosting provider
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow the existing code style (ESLint configuration)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Build test
npm run build
```

## 📚 API Documentation

### Edge Functions

#### `analyze-responses`
Analyzes comprehensive assessment responses using OpenAI.

#### `analyze-concise-responses`
Provides quick personality insights for shorter assessments.

#### `generate-activity`
Creates personalized growth activities based on user profiles.

### Supabase Integration

All database operations use Supabase's built-in security:
- Row Level Security (RLS) policies
- User authentication and authorization
- Real-time subscriptions
- File storage with access controls

## 🔒 Security

- All API keys are stored securely in Supabase Edge Function secrets
- User data is protected with Row Level Security
- Authentication is handled by Supabase Auth
- No sensitive data is exposed in the frontend code
- CORS policies are properly configured

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for AI analysis capabilities
- [Supabase](https://supabase.com/) for backend infrastructure
- [Radix UI](https://radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling system
- The open-source community for inspiration and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/opensource-ai-personality-quiz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/opensource-ai-personality-quiz/discussions)
- **Email**: support@yourapp.com

## 🌟 Star History

If you find this project helpful, please consider giving it a star ⭐

---

**Built with ❤️ by the Open Source AI Personality Quiz team**