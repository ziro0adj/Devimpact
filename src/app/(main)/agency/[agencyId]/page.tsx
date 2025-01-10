import CircleProgress from '@/components/global/circle-progress'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { AreaChart } from '@tremor/react'
import {
    ClipboardIcon,
    Contact2,
    DollarSign,
    Goal,
    ShoppingCart,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = async ({
    params,
}: {
    params: { agencyId: string }
    searchParams: { code: string }
}) => {
    let currency = 'USD'
    let sessions
    let totalClosedSessions
    let totalPendingSessions
    let net = 0
    let potentialIncome = 0
    let closingRate = 0
    const currentYear = new Date().getFullYear()
    const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000
    const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000

    const agencyDetails = await db.agency.findUnique({
        where: {
            id: params.agencyId,
        },
    })

    if (!agencyDetails) return

    const subaccounts = await db.subAccount.findMany({
        where: {
            agencyId: params.agencyId,
        },
    })

    if (agencyDetails.connectAccountId) {
        const response = await stripe.accounts.retrieve({
            stripeAccount: agencyDetails.connectAccountId,
        })

        currency = response.default_currency?.toUpperCase() || 'USD'
        const checkoutSessions = await stripe.checkout.sessions.list(
            {
                created: { gte: startDate, lte: endDate },
                limit: 100,
            },
            { stripeAccount: agencyDetails.connectAccountId }
        )
        sessions = checkoutSessions.data
        totalClosedSessions = checkoutSessions.data
            .filter((session) => session.status === 'complete')
            .map((session) => ({
                ...session,
                created: new Date(session.created).toLocaleDateString(),
                amount_total: session.amount_total ? session.amount_total / 100 : 0,
            }))

        totalPendingSessions = checkoutSessions.data
            .filter((session) => session.status === 'open')
            .map((session) => ({
                ...session,
                created: new Date(session.created).toLocaleDateString(),
                amount_total: session.amount_total ? session.amount_total / 100 : 0,
            }))
        net = +totalClosedSessions
            .reduce((total, session) => total + (session.amount_total || 0), 0)
            .toFixed(2)

        potentialIncome = +totalPendingSessions
            .reduce((total, session) => total + (session.amount_total || 0), 0)
            .toFixed(2)

        closingRate = +(
            (totalClosedSessions.length / checkoutSessions.data.length) *
            100
        ).toFixed(2)
    }

    return (
        <div className="relative h-full">

            <h1 className="text-4xl">Dashboard</h1>
            <Separator className=" my-6" />
            <div className="flex flex-col gap-4 pb-6">
                <div className="flex gap-4 flex-col xl:!flex-row">
                <Card className="flex-1 relative">
                        <CardHeader>
                            <CardDescription>Actives students</CardDescription>
                            <CardTitle className="text-4xl">{subaccounts.length}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Reflects the number of active students on your platform .
                        </CardContent>
                        <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
                    </Card>
                    <Card className="flex-1 relative">
                        <CardHeader>
                            <CardDescription>Activet teachers</CardDescription>
                            <CardTitle className="text-4xl">{subaccounts.length}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Reflects the number of teachers on your platform.
                        </CardContent>
                        <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
                    </Card>
                    <Card className="flex-1 relative">
                        <CardHeader>
                            <CardDescription>Number of classes</CardDescription>
                            <CardTitle className="text-4xl">{subaccounts.length}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Reflects the number of classes on your platform.
                        </CardContent>
                        <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
                    </Card>
                    <Card className="flex-1 relative">
                        <CardHeader>
                            <CardTitle>Members goal</CardTitle>
                            <CardDescription>
                                <p className="mt-2">
                                    Reflects the number of members you aim to achieve 
                                </p>
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <div className="flex flex-col w-full">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground text-sm">
                                        Current: {subaccounts.length}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                        Goal: {agencyDetails.goal}
                                    </span>
                                </div>
                                <Progress
                                    value={(subaccounts.length / agencyDetails.goal) * 100}
                                />
                            </div>
                        </CardFooter>
                        <Goal className="absolute right-4 top-4 text-muted-foreground" />
                    </Card>
                </div>
                <div className="flex gap-4 xl:!flex-row flex-col">
                   
                    
                </div>
            </div>
        </div>
    )
}

export default Page