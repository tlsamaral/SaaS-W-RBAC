'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChevronsUpDown, Link } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useParams } from 'next/navigation'
import { getProjects } from '@/http/get-projects'
import { useQuery } from '@tanstack/react-query'

export function ProjectSwitcher() {
  const { slug: orgSlug } = useParams<{
    slug: string
  }>()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', orgSlug],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
  })

  console.log(projects)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {/* {currentorganization ? (
          <>
            <Avatar className="mr-2 size-4">
              {currentorganization.avatarUrl && (
                <AvatarImage src={currentorganization.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="truncate text-left">
              {currentorganization.name}
            </span>
          </>
        ) : ( */}
        <span className="text-muted-foreground">Select project</span>
        {/* )} */}

        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {/* {organizations.map((organization) => {
            return ( */}
          <DropdownMenuItem /*key={organization.id}*/ asChild>
            <Link href={''}>
              <Avatar className="mr-2 size-4">
                {/* {organization.avatarUrl && (
                      <AvatarImage src={organization.avatarUrl} />
                    )} */}
                <AvatarFallback />
              </Avatar>
              <span className="line-clamp-1">Projeto teste</span>
            </Link>
          </DropdownMenuItem>
          {/* )
          })} */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="size-4 mr-2" />
            New organization
          </Link>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
