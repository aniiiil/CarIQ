import { SettingForm } from "./_components/setting-form"

export const metadata = {
  title: "Settings | CarIQ Admin",
  description: "Manage dealership working hours and admin users",
}
const SettingsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <SettingForm />
    </div>
  )
}

export default SettingsPage
