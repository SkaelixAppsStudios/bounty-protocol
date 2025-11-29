"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Typography,
    Button,
    Input,
    Card,
    Toaster,
    toast
} from "@whop/frosted-ui";
import { PageHeader } from "@/components/branding/PageHeader";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function NewBountyPage({ params }: { params: { companyId: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        rate_per_1k: "",
        max_budget: "",
        video_url: "" // For now, simple URL input instead of file upload to start fast
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const rate = parseFloat(formData.rate_per_1k);
            const budget = parseFloat(formData.max_budget);

            if (isNaN(rate) || isNaN(budget)) {
                throw new Error("Invalid numbers");
            }

            await addDoc(collection(db, "bounties"), {
                creator_id: params.companyId, // Using companyId as creator_id for now
                title: formData.title,
                description: formData.description,
                rate_per_1k: rate,
                max_budget: budget,
                remaining_budget: budget,
                video_url: formData.video_url,
                status: "active",
                created_at: serverTimestamp(),
            });

            toast.success("Bounty created successfully!");
            router.push(`/dashboard/${params.companyId}/bounties`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create bounty");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Toaster />
            <PageHeader
                title="Create New Bounty"
                subtitle="Launch a new UGC marketing campaign"
            />

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <div className="space-y-2">
                        <Typography.Text size="2" weight="medium">Bounty Title</Typography.Text>
                        <Input
                            placeholder="e.g., Summer Sale TikTok Challenge"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Typography.Text size="2" weight="medium">Description</Typography.Text>
                        <Input
                            as="textarea"
                            rows={3}
                            placeholder="Instructions for hunters..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Typography.Text size="2" weight="medium">Rate per 1k Views ($)</Typography.Text>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="1.00"
                                value={formData.rate_per_1k}
                                onChange={(e) => setFormData({ ...formData, rate_per_1k: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Typography.Text size="2" weight="medium">Max Budget ($)</Typography.Text>
                            <Input
                                type="number"
                                step="10.00"
                                placeholder="500.00"
                                value={formData.max_budget}
                                onChange={(e) => setFormData({ ...formData, max_budget: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Typography.Text size="2" weight="medium">Asset URL (Video/Sound)</Typography.Text>
                        <Input
                            placeholder="https://..."
                            value={formData.video_url}
                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                            required
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={loading}
                        >
                            Launch Bounty
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
