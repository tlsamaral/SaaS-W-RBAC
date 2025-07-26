import { getCurrentOrg } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getProjects } from '@/http/get-projects'
import { ArrowRight } from 'lucide-react'

export async function ProjectList() {
  const org = await getCurrentOrg()
  const { projects } = await getProjects(org)

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((project) => {
        return (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription className="line-clamp-2 leading-relaxed">
                {project.description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex items-center gap-1.5">
              <Avatar className="size-4">
                {project.avatarUrl && <AvatarImage src={project.avatarUrl} />}
                <AvatarFallback />
              </Avatar>

              <span className="text-xs text-muted-foreground">
                Created by{' '}
                <span className="font-medium text-foreground">
                  {project.owner.name}
                </span>{' '}
                a day ago
              </span>

              <Button size="xs" variant="outline" className="ml-auto">
                View
                <ArrowRight className="size-3" />
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
