import { Code, Slash } from 'lucide-react'
import { ProfileButton } from './profile-button'
import { OrganizationSwicther } from './organization-switcher'

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Code className="size-6" />
        <Slash className="size-3 -rotate-24 text-border" />

        <OrganizationSwicther />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
