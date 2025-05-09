
# CarIQ   🚗 | Next-Gen Car Sales

CarIQ is a modern, full-stack web application designed for buying and selling vehicles. Built with cutting-edge technologies like **Next.js**, **Supabase**, **Prisma**, and **Tailwind CSS**, CarIQ provides a sleek, responsive, and efficient experience for automotive marketplace users.

#### 🌐 Live Demo
You can explore a live version of CarIQ at [Live 🚀](https://car-iq-virid.vercel.app)



## ✨ Features

- 🚘 Post, browse, and search vehicle listings
- 🙎‍♂️ Admin dashboard to manage car data & Sale Analatics
- 🤖 Implement Google Gemini AI for car search with image and     to extract car details.
- 🔐 User authentication via Supabase & Clerk
- 📸 Upload and display car images
- 🔎 Filter cars by price, model, type, and more
- 📱 Fully responsive design for all devices
- ⚡ Fast and smooth user experience

---

## 🔧 Tech Stack

| Technology     | Purpose                          |
|----------------|----------------------------------|
| **Next.js**     | React framework for SSR & routing |
| **Supabase**    | Backend as a service (auth, DB)  |
| **Prisma**      | Type-safe ORM for PostgreSQL     |
| **Tailwind CSS**| Utility-first styling            |
| **Shadcn/UI**   | Beautiful and accessible UI      |

---

## 📁 Project Structure

The project is organized into several key directories:


* app/: Contains the main application components and pages.

* components/: Houses reusable UI components.

* hooks/: Includes custom React hooks for state and effect management.

* lib/: Contains utility functions and libraries.

* prisma/: Holds Prisma schema and migration files.

* public/: Stores static assets like images and fonts.







## 🚀 Getting Started

1. Clone the repository :

```bash
git clone https://github.com/aniiiil/CarIQ.git
cd CarIQ

```
2. Navigate to the Project Directory & install Dependencies :
```bash
  cd KLIMATE
  npm install
```
3. Set Up Environment Variables :
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_postgresql_database_url
```
4. Start the Development Server:
```bash
   npm start
```
Visit http://localhost:3000 to view the app.



# 🗃 Database
```bash 
npx prisma migrate dev
npx prisma generate
```

# 🙌 Contributing
We welcome contributions! Feel free to fork the repo and submit a pull request.

# 👤 Author
Anil Prajapat
[🔗Github](https://github.com/aniiiil)

