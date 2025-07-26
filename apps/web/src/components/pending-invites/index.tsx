'use client'

import { Check, UserPlus2, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPendingInvites } from '@/http/get-pending-invites'
import { useState } from 'react'
import { acceptInviteAction, rejectInviteAction } from './actions'

dayjs.extend(relativeTime)

export function PendingInvites() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <span className="sr-only">Pending invites</span>
          <UserPlus2 />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 flex flex-col gap-2">
        <span className="text-sm font-medium">
          Pending invites ({data?.invites.length ?? 0})
        </span>

        {data.invites.length === 0 && (
          <p className="text-sm leading-relaxed text-muted-foreground text-balance">
            You have no pending invites.
          </p>
        )}

        {!isLoading
          ? data.invites.map((invite) => {
              return (
                <div className="space-y-2" key={invite.id}>
                  <p className="text-sm leading-relaxed text-muted-foreground text-balance">
                    <span className="font-medium text-foreground">
                      {invite.author.name ?? 'Someone'}
                    </span>{' '}
                    invited you to join{' '}
                    <span className="font-medium text-foreground">
                      {invite.organization.name}
                    </span>{' '}
                    <span>{dayjs(invite.createdAt).fromNow()}</span>
                  </p>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleAcceptInvite(invite.id)}
                    >
                      <Check className="size-3" />
                      Accept
                    </Button>

                    <Button
                      variant="ghost"
                      className="text-muted-foreground"
                      size="xs"
                      onClick={() => handleRejectInvite(invite.id)}
                    >
                      <X className="size-3" />
                      Decline
                    </Button>
                  </div>
                </div>
              )
            })
          : null}
      </PopoverContent>
    </Popover>
  )
}
