import StudentRegistrationForm from "@/components/student-registration-form"

export default function RegisterPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-white  shadow">
      <StudentRegistrationForm mode="public" submitUrl="/api/register" />
    </div>
  )
}