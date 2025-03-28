import { Code, Slash } from 'lucide-react'
import { ProfileButton } from './profile-button'
import { OrganizationSwicther } from './organization-switcher'
import { ability } from '@/auth/auth'
import { ThemeSwitcher } from './theme/theme-switcher'
import { Separator } from './ui/separator'

export async function Header() {
  const permissions = await ability()

  if (!permissions) {
    return null
  }

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Code className="size-6" />
        <Slash className="size-3 -rotate-24 text-border" />

        <OrganizationSwicther />

        {permissions.can('get', 'Project') && <p>Projects</p>}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
