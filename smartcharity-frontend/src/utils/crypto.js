// This mimics the backend hash logic to prove data integrity
export const verifyIntegrity = async (donation) => {
    const rawData = donation.userId + donation.ngoId + donation.amount + donation.timestamp;

    // Use the Web Crypto API (standard in modern browsers)
    const msgUint8 = new TextEncoder().encode(rawData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = btoa(String.fromCharCode.apply(null, hashArray));

    return hashHex === donation.auditHash;
};