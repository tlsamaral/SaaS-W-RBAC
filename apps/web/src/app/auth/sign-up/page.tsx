import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

import githubIcon from '@/assets/github-icon.svg'
import Image from 'next/image'

export default function SignInPage() {
	return (
		<form className="space-y-4">
			<div className="space-y-1">
				<Label htmlFor="email">Name</Label>
				<Input name="name" id="name" />
			</div>

			<div className="space-y-1">
				<Label htmlFor="email">E-mail</Label>
				<Input name="email" type="email" id="email" />
			</div>

			<div className="space-y-1">
				<Label htmlFor="password">Password</Label>
				<Input name="password" type="password" id="password" />
			</div>

			<div className="space-y-1">
				<Label htmlFor="password_confirmation">Confirme Password</Label>
				<Input
					name="password_confirmation"
					type="password"
					id="password_confirmation"
				/>
			</div>

			<Button className="w-full" type="submit">
				Create account
			</Button>

			<Button className="w-full" variant="link" size="sm" asChild>
				<Link href="/auth/sign-in">Already registered? Sign in</Link>
			</Button>

			<Separator />

			<Button variant="outline" className="w-full">
				<Image
					src={githubIcon}
					alt=""
					className="mr-2 size-4 dark:invert"
					width={16}
					height={16}
				/>{' '}
				Sign up with GitHub
			</Button>
		</form>
	)
}
