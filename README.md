# Pomodoro Timer

A feature-rich Pomodoro timer web application built with Next.js.

## Features

- Multiple timer modes (Pomodoro, Short Break, Long Break)
- Customizable settings
- Visual progress indicators
- Focus mode
- Sound notifications
- Different themes

## Deployment on Vercel

This project is optimized for deployment on Vercel.

### One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusername%2Fpomodoro-timer)

### Manual Deployment

1. Fork or clone this repository
2. Import your repository to Vercel
3. Set up the required environment variables (see below)
4. Deploy!

### Environment Variables

This project uses Supabase for the live user counter. You'll need to set up these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous API key

See the `setup-supabase.md` file for detailed setup instructions.

## Local Development

1. Clone the repository

   ```bash
   git clone https://github.com/username/pomodoro-timer.git
   cd pomodoro-timer
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
```

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
