// socialActions.js

import { db } from "../../../../firebase/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore";

// 1. Friend Request Bhejna
export const sendFriendRequest = async (myEmail, targetEmail) => {
    if (!myEmail || !targetEmail || myEmail === targetEmail) return;
    const targetRef = doc(db, "socialProfiles", targetEmail);
    try {
        const snap = await getDoc(targetRef);
        if (!snap.exists()) {
            await setDoc(targetRef, { 
                pendingRequests: [myEmail], 
                followers: [], 
                following: [], 
                bio: "Student at DIIT" 
            });
        } else {
            await updateDoc(targetRef, { pendingRequests: arrayUnion(myEmail) });
        }
    } catch (err) { console.error("Send Request Error:", err); }
};

// 2. Request Cancel Karna
export const cancelRequest = async (myEmail, targetEmail) => {
    if (!myEmail || !targetEmail) return;
    const targetRef = doc(db, "socialProfiles", targetEmail);
    try {
        await updateDoc(targetRef, { pendingRequests: arrayRemove(myEmail) });
    } catch (err) { console.error("Cancel Error:", err); }
};

// 3. Accept/Decline/Unfriend Logic
export const handleFriendAction = async (myEmail, targetEmail, action) => {
    if (!myEmail || !targetEmail) return;

    const myRef = doc(db, "socialProfiles", myEmail);
    const targetRef = doc(db, "socialProfiles", targetEmail);

    try {
        if (action === "accept") {
            // STEP 1: Mere doc se request hatao aur followers (dost) mein dalo
            await updateDoc(myRef, {
                followers: arrayUnion(targetEmail),
                pendingRequests: arrayRemove(targetEmail)
            });
            // STEP 2: Samne wale ke following mein mujhe dalo
            await updateDoc(targetRef, {
                following: arrayUnion(myEmail)
            });
        } 
        else if (action === "decline") {
            await updateDoc(myRef, {
                pendingRequests: arrayRemove(targetEmail)
            });
        }
        else if (action === "unfriend") {
            // Dono taraf se dosti khatam
            await updateDoc(myRef, { followers: arrayRemove(targetEmail), following: arrayRemove(targetEmail) });
            await updateDoc(targetRef, { followers: arrayRemove(myEmail), following: arrayRemove(myEmail) });
        }
    } catch (err) {
        console.error("Permission ya Network Error:", err);
        alert("Action failed: Check your internet or permissions.");
    }
};