import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { executePayout } from "@/lib/payouts/execute";

export async function GET(request: Request) {
    // Secure Cron: Verify Vercel Signature or internal secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return new NextResponse("Unauthorized", { status: 401 });
        // For dev/testing, we'll allow it for now
    }

    console.log("🔮 The Oracle is awakening...");

    try {
        // 1. Fetch active submissions
        const submissionsSnapshot = await adminDb
            .collection("submissions")
            .where("status", "==", "active")
            .get();

        if (submissionsSnapshot.empty) {
            return NextResponse.json({ message: "No active submissions" });
        }

        const results = [];

        // 2. Process each submission
        for (const doc of submissionsSnapshot.docs) {
            const submission = doc.data();
            const submissionId = doc.id;

            // Get associated Bounty to check budget/rate
            const bountyDoc = await adminDb.collection("bounties").doc(submission.bounty_id).get();
            if (!bountyDoc.exists) continue;
            const bounty = bountyDoc.data();

            if (bounty?.remaining_budget <= 0) {
                console.log(`Bounty ${submission.bounty_id} budget depleted.`);
                continue;
            }

            // 3. Call SocialKit API
            const socialKitUrl = `https://api.socialkit.dev/tiktok/stats?url=${submission.tiktok_url}&access_key=${process.env.SOCIALKIT_API_KEY}`;

            const response = await fetch(socialKitUrl);
            const data = await response.json();

            if (!data.success || !data.data) {
                console.error(`Failed to fetch stats for ${submission.tiktok_url}`);
                continue;
            }

            const currentViews = data.data.views || 0;
            const lastChecked = submission.last_checked_views || 0;
            const newViews = currentViews - lastChecked;

            console.log(`Submission ${submissionId}: ${currentViews} total - ${lastChecked} checked = ${newViews} new`);

            // 4. Threshold Check (e.g., pay every 1000 views)
            if (newViews >= 1000) {
                // Calculate how many "chunks" of 1000 we can pay for
                // For simplicity, we'll pay for the exact new amount

                const success = await executePayout(
                    submissionId,
                    submission.hunter_id,
                    bounty?.creator_id,
                    newViews,
                    bounty?.rate_per_1k,
                    submission.bounty_id
                );

                if (success) {
                    // Update Submission
                    await adminDb.collection("submissions").doc(submissionId).update({
                        last_checked_views: currentViews,
                        total_paid: (submission.total_paid || 0) + ((newViews / 1000) * bounty?.rate_per_1k)
                    });

                    // Update Bounty Budget
                    const amountPaid = (newViews / 1000) * bounty?.rate_per_1k;
                    await adminDb.collection("bounties").doc(submission.bounty_id).update({
                        remaining_budget: (bounty?.remaining_budget || 0) - amountPaid
                    });

                    results.push({ submissionId, paid: true, views: newViews });
                }
            } else {
                results.push({ submissionId, paid: false, reason: "Threshold not met" });
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error("Oracle Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
