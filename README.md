# Body Tracker App 🏋️‍♂️📊

This is a personal fitness tracking web application built with **SvelteKit** that helps users monitor their body measurements, meals, and workouts over time. The app stores data securely in a **PostgreSQL** database accessed via **Prisma ORM** and is designed for responsive use on desktop and mobile devices.

---

## Features

- **Body Measurements Tracking:** Log daily measurements including waist, hips, thigh, arm, chest, under navel circumference, and weight.
- **Meal Tracking:** Add meals with multiple food items, automatically fetching nutritional info (calories, protein, carbs, fat) from Nutritionix API.
- **Workout Logging:** Record workouts with exercises and sets (reps and weight).
- **History & Progress Visualizations:**
  - Weight progression chart over the last 30 days.
  - Daily calorie intake chart aggregated from meals.
  - Individual measurement trends.
  - Workout calendar showing days and types of workouts performed.
- **User Authentication:** Secure user management (implemented with sessions).
- **Responsive UI:** Works well on phones and desktops.

---

## Tech Stack

- **Frontend:** SvelteKit + TailwindCSS for styling
- **Backend:** SvelteKit API routes + Prisma ORM
- **Database:** PostgreSQL hosted on Render.com
- **Nutrition Data:** Nutritionix API integration for meal nutrient data
- **Charting:** Chart.js for interactive progress visualizations
- **Deployment:** Render.com for hosting both app and database

---

## Database Schema Highlights

- **User** with unique email and password (hashed)
- **Measurement:** daily tracked body measurements, unique per user and date
- **Meal:** multiple meals per day, each with JSONB items containing nutrition info
- **Workout:** workout sessions with JSONB exercises and sets
- Relationships are managed via Prisma relations, ensuring data integrity and user association.

---

## How It Works

1. Users register and log in.
2. Each day, users can:
   - Record body measurements.
   - Add meals, where the app fetches nutrition data for each food item.
   - Log workout exercises and sets.
3. Data is saved to the PostgreSQL database via secure API routes.
4. The **History** page fetches and visualizes the data:
   - Weight and calorie trends via line charts.
   - Individual measurement trends via small line charts.
   - Workout days highlighted on a calendar with labels (e.g., ДЕН 1 – Долна част).
5. All date/time data is stored and queried as ISO8601 timestamps for consistency.

---

## Deployment Instructions

To deploy this app on Render.com:

1. Push your latest code to a GitHub repository.
2. On Render.com, create a new **Web Service**, connect your repo.
3. Set the build command to `npm install && npm run build`.
4. Set the start command to `npm run preview`.
5. Add your environment variables (e.g., `DATABASE_URL`, Nutritionix API keys).
6. Create or connect a PostgreSQL database and add its connection string as `DATABASE_URL`.
7. Deploy and access the app via the provided URL.

---

## Development

- Clone the repo.
- Run `npm install`.
- Create a `.env` file with required variables (see `.env.example`).
- Run locally with `npm run dev`.
- Run Prisma migrations with `npx prisma migrate dev` when schema changes.
- Use `npm run build` and `npm run preview` to test production build locally.

---

## Future Improvements

- Add real user authentication with OAuth or JWT.
- Enable editing and deleting past meals/workouts.
- Add notifications/reminders for daily logging.
- Improve workout calendar with filtering and detailed stats.
- Add more detailed meal nutritional breakdown and charts.

---

## Credits

Created by Silvia Popova, combining frontend, backend, and data science skills for a practical fitness tracking solution.

---

## License

MIT License

