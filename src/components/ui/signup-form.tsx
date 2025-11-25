import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export function SignupForm({
    className,
    onLoginClick,
    onClose,
    ...props
}: React.ComponentPropsWithoutRef<"div"> & {
    onLoginClick?: () => void
    onClose?: () => void
}) {
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Show success toast
        toast.success("Account created successfully!", {
            description: "Welcome to Art Print",
        })

        // Close modal if onClose is provided
        if (onClose) {
            onClose()
        }

        // Navigate to homepage
        setTimeout(() => {
            navigate("/")
        }, 500)
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your information below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required />
                                <p className="text-sm text-muted-foreground">
                                    Must be at least 8 characters long.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input id="confirm-password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Create Account
                            </Button>
                            <Button variant="outline" className="w-full" type="button">
                                Sign up with Google
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <a
                                href="#"
                                className="underline underline-offset-4"
                                onClick={(e) => {
                                    e.preventDefault()
                                    onLoginClick?.()
                                }}
                            >
                                Sign in
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
