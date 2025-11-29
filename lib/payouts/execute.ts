import { adminDb } from "@/lib/firebase/admin";
import { whopsdk } from "@/lib/whop-sdk";

export async function executePayout(
    submissionId: string,
    hunterId: string,
    creatorId: string,
    newViews: number,
    ratePer1k: number,
    bountyId: string
) {
    // 1. Calculate Gross Amount
    // Example: 5000 views * $1.00/1k = $5.00
    const grossAmount = (newViews / 1000) * ratePer1k;

    // Round to 2 decimals to avoid floating point weirdness
    const grossRounded = Math.round(grossAmount * 100) / 100;

    if (grossRounded <= 0) return;

    // 2. Trial Check (Fee Logic)
    // Get Creator's join date or first bounty date to determine trial status
    // For MVP, we'll assume standard 10% fee for now unless we store creator join date
    const feePercent = 0.10; // 10%

    const platformFee = Math.round((grossRounded * feePercent) * 100) / 100;
    const hunterPayout = Math.round((grossRounded - platformFee) * 100) / 100;

    console.log(`💰 Payout: Gross $${grossRounded} | Net $${hunterPayout} | Fee $${platformFee}`);

    try {
        // 3. Atomic Transfer via Whop API
        // Transfer to Hunter
        await whopsdk.transfers.create({
            to: hunterId,
            from: creatorId,
            amount: hunterPayout,
            currency: "USD",
            memo: `Bounty Payout for ${newViews} views`
        });

        // Transfer Fee to App Wallet (Platform)
        // Note: In real Whop App, you'd transfer to your own wallet ID
        // await whopsdk.transfers.create({ ... });

        // 4. Log Transaction in Firestore
        await adminDb.collection("transactions").add({
            submission_id: submissionId,
            bounty_id: bountyId,
            hunter_id: hunterId,
            creator_id: creatorId,
            gross_amount: grossRounded,
            net_amount: hunterPayout,
            fee_amount: platformFee,
            views_paid: newViews,
            timestamp: new Date(),
            status: "success"
        });

        return true;
    } catch (error) {
        console.error("Payout failed:", error);
        // Log failed transaction
        await adminDb.collection("transactions").add({
            submission_id: submissionId,
            bounty_id: bountyId,
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date(),
            status: "failed"
        });
        return false;
    }
}
