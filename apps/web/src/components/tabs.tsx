import { Button } from './ui/button'
import { getCurrentOrg } from '@/auth/auth'
import { NavLink } from './nav-link'

export async function Tabs() {
  const currentOrg = await getCurrentOrg()

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground border border-transparent data-[current='true']:text-foreground data=[current='true']:border-border"
          asChild
        >
          <NavLink href={`/org/${currentOrg}`}>Projects</NavLink>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground border border-transparent data-[current='true']:text-foreground data=[current='true']:border-border"
          asChild
        >
          <NavLink href={`/org/${currentOrg}/members`}>Members</NavLink>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground border border-transparent data-[current='true']:text-foreground data=[current='true']:border-border"
          asChild
        >
          <NavLink href={`/org/${currentOrg}/settings`}>
            Settings & Billing
          </NavLink>
        </Button>
      </nav>
    </div>
  )
}
