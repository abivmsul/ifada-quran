import StudentRegistrationForm from "@/components/student-registration-form"

export default function AdminRegisterStudentPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <StudentRegistrationForm
        mode="admin"
        submitUrl="/api/admin/register-student"
      />
    </div>
  )
}