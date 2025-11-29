"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Typography,
    Button,
    Card,
    Spinner,
    Badge
} from "@whop/frosted-ui";
import { PageHeader } from "@/components/branding/PageHeader";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Bounty {
    id: string;
    title: string;
    rate_per_1k: number;
    remaining_budget: number;
    status: string;
}

export default function BountiesListPage({ params }: { params: { companyId: string } }) {
    const router = useRouter();
    const [bounties, setBounties] = useState<Bounty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBounties = async () => {
            try {
                const q = query(
                    collection(db, "bounties"),
                    where("creator_id", "==", params.companyId)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Bounty[];
                setBounties(data);
            } catch (error) {
                console.error("Error fetching bounties:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBounties();
    }, [params.companyId]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <PageHeader
                    title="Bounty Vault"
                    subtitle="Manage your active marketing campaigns"
                />
                <Button onClick={() => router.push(`/dashboard/${params.companyId}/bounties/new`)}>
                    Create Bounty
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            ) : bounties.length === 0 ? (
                <Card className="p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💰</span>
                    </div>
                    <Typography.Title size="3">The Vault is Empty</Typography.Title>
                    <Typography.Text color="gray">
                        You haven't created any bounties yet. Start your first campaign to get views.
                    </Typography.Text>
                    <Button onClick={() => router.push(`/dashboard/${params.companyId}/bounties/new`)}>
                        Launch First Bounty
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {bounties.map((bounty) => (
                        <Card key={bounty.id} className="p-4 flex justify-between items-center hover:bg-gray-800/50 transition-colors cursor-pointer">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <Typography.Text weight="medium">{bounty.title}</Typography.Text>
                                    <Badge color={bounty.status === 'active' ? 'grass' : 'gray'}>
                                        {bounty.status}
                                    </Badge>
                                </div>
                                <Typography.Text size="2" color="gray">
                                    ${bounty.rate_per_1k} per 1k views
                                </Typography.Text>
                            </div>
                            <div className="text-right">
                                <Typography.Text size="2" color="gray" className="block">Remaining Budget</Typography.Text>
                                <Typography.Text weight="bold" color={bounty.remaining_budget < 50 ? 'tomato' : 'grass'}>
                                    ${bounty.remaining_budget.toFixed(2)}
                                </Typography.Text>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
