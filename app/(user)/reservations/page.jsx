import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { getUserTestDrives } from "@/actions/test-drive"
import { ReservationsList } from "./_components/reservations-list"

export const metadata = {
  title: "My Reservations | CarIQ",
  description: "Manage your test drive reservations",
}

export default async function ReservationsPage() {
  // Check authentication on server
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in?redirect=/reservations")
  }

  // Fetch reservations on the server
  const reservationsResult = await getUserTestDrives()

  return (
    <div className="container mx-auto px-4 pb-12">
      <h1 className="text-4xl  md:text-6xl mb-6 gradient-title">
        Your Reservations
      </h1>
      <ReservationsList initialData={reservationsResult} />
    </div>
  )
}
