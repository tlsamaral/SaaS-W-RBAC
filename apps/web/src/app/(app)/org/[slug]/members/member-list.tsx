import { getCurrentOrg } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMembers } from '@/http/get-members'
import { getMembership } from '@/http/get-membership'
import { getOrganization } from '@/http/get-organization'
import { Crown } from 'lucide-react'

export async function MemberList() {
  const currentOrg = await getCurrentOrg()
  const { membership } = await getMembership(currentOrg)
  const { members } = await getMembers(currentOrg)
  const { organization } = await getOrganization({ org: currentOrg })

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Avatar>
                      <AvatarFallback />
                      {member.avatarUrl && (
                        <AvatarImage
                          src={member.avatarUrl}
                          width={32}
                          height={32}
                          alt=""
                          className="aspect-square size-full"
                        />
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="font-medium inline-flex items-center gap-2">
                        {member.name}
                        {member.id === membership.id && (
                          <span className="text-xs text-muted-foreground">
                            (You)
                          </span>
                        )}
                        {organization.ownerId === member.id && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Crown className="size-4" />
                            (Owner)
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {member.email}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
