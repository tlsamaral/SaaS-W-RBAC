import { auth } from '@/auth/auth'

export default async function Projects() {
  const { user } = await auth()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Projects</h1>
    </div>
  )
}
