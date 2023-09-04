const admin = require('./firebaseAdmin.js');  // Import the initialized Firebase app from firebaseAdmin.js
const crypto = require('crypto');


const db = admin.firestore();

async function joinLobby(data) {
    try {
        const { username, roomKey } = data;

        // Get reference to the room
        const roomRef = admin.firestore().collection('rooms').doc(roomKey);

        // Get the existing documents in the players collection
        const playersCollection = roomRef.collection('players');
        const playersSnapshot = await playersCollection.get();

        // Find the highest existing document ID
        let highestId = 0;
        playersSnapshot.forEach(doc => {
            const docId = parseInt(doc.id, 10);
            if (docId > highestId) {
                highestId = docId;
            }
        });

        // Reject if the highest document ID equals 6 (meaning the lobby is full)
        if (highestId === 6) {
            throw new Error('Lobby is full');
        }

        // The new document ID will be one greater than the highest existing document ID
        const newDocumentId = (highestId + 1).toString();

        // Add the new player as a document in the players collection
        await playersCollection.doc(newDocumentId).set({
            username: username,
            score: 0,
            guessCount: 0,
        });

        console.log(`User ${username} joined the lobby with room key: ${roomKey}`);
    } catch (error) {
        console.error('Error joining the lobby:', error);
    }
}


//export for use at server.js
module.exports = joinLobby;