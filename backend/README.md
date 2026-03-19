# Tech Stack
- Express
- Prisma
- PostgreSQL
- BetterAuth

# How to run?
1. Install dependencies: `npm install`
2. Create a `.env` file with your `DATABASE_URL` and `BETTER_AUTH_SECRET`
3. Push the database schema: `npx prisma db push`
4. Generate the Prisma client: `npx prisma generate`
5. Start the dev server: `npm run dev`

# Challenge
It's a relatively a small project built only to understand websites like Reddit, etc. How does it work on the database cause it needs to store a lot of things for milions of users. The search bar will do for now, but as the app grows the search bar will be slow cause let's say your searching "Dan" in the search bar there will be Jordan, Daniel, etc. You'll have to add more time searching whjat you're looking for. 

Also no API key protection (since i'm not building it for a MVP project, i'm not going to apply it).