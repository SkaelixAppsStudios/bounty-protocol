"use client";

import { useEffect, useState } from "react";
import {
    Typography,
    Button,
    Input,
    Card,
    Toaster,
    toast,
    Spinner,
    Badge
} from "@whop/frosted-ui";
import { PageHeader } from "@/components/branding/PageHeader";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Bounty {
    id: string;
    title: string;
    description: string;
    rate_per_1k: number;
    video_url: string;
}

export default function HunterPage({ params }: { params: { experienceId: string } }) {
    const [bounties, setBounties] = useState<Bounty[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [tiktokLinks, setTiktokLinks] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchBounties = async () => {
            try {
                const q = query(
                    collection(db, "bounties"),
                    where("status", "==", "active")
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
    }, []);

    const handleSubmit = async (bountyId: string) => {
        const link = tiktokLinks[bountyId];
        if (!link || !link.includes("tiktok.com")) {
            toast.error("Please enter a valid TikTok link");
            return;
        }

        setSubmitting(bountyId);

        try {
            // 1. Verify link with SocialKit (Client-side check for UX)
            // In production, we should proxy this through our API to hide the key, 
            // but for MVP/Speed we'll do a quick check here or just save it and let the Oracle verify.
            // Let's just save it for now and let the Oracle do the heavy lifting to keep it simple.

            await addDoc(collection(db, "submissions"), {
                bounty_id: bountyId,
                hunter_id: "current_user", // We need to get the real user ID from Whop SDK
                tiktok_url: link,
                last_checked_views: 0,
                total_paid: 0,
                status: "active",
                created_at: serverTimestamp(),
            });

            toast.success("Submission received! Tracking started.");
            setTiktokLinks({ ...tiktokLinks, [bountyId]: "" }); // Clear input
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit link");
        } finally {
            setSubmitting(null);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Toaster />
            <PageHeader
                title="Bounty Board"
                subtitle="Find campaigns, create content, get paid."
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            ) : bounties.length === 0 ? (
                <Card className="p-12 text-center">
                    <Typography.Title size="3">No Active Bounties</Typography.Title>
                    <Typography.Text color="gray">Check back later for new campaigns.</Typography.Text>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {bounties.map((bounty) => (
                        <Card key={bounty.id} className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Typography.Title size="3">{bounty.title}</Typography.Title>
                                    <Typography.Text color="gray" className="mt-1 block">
                                        {bounty.description}
                                    </Typography.Text>
                                </div>
                                <Badge color="grass" size="3">
                                    ${bounty.rate_per_1k} / 1k views
                                </Badge>
                            </div>

                            <div className="bg-gray-800/50 p-3 rounded-md">
                                <Typography.Text size="1" color="gray" className="uppercase tracking-wider font-bold mb-2 block">
                                    Asset
                                </Typography.Text>
                                <a
                                    href={bounty.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
                                >
                                    ⬇️ Download Asset
                                </a>
                            </div>

                            <div className="pt-4 border-t border-gray-800">
                                <Typography.Text size="2" weight="medium" className="mb-2 block">
                                    Submit Your TikTok
                                </Typography.Text>
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="https://www.tiktok.com/@user/video/..."
                                        value={tiktokLinks[bounty.id] || ""}
                                        onChange={(e) => setTiktokLinks({ ...tiktokLinks, [bounty.id]: e.target.value })}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={() => handleSubmit(bounty.id)}
                                        isLoading={submitting === bounty.id}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
