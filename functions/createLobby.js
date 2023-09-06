const admin = require('./firebaseAdmin.js');  // Import the initialized Firebase app from firebaseAdmin.js
const crypto = require('crypto');

function generateRoomKey() {
    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456788'; // Removed lowercase characters
    let key = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = crypto.randomInt(0, possibleCharacters.length);
        key += possibleCharacters[randomIndex];
    }

    return key;
}

const db = admin.firestore();

// This function will now take a data parameter to use for creating the lobby
async function createLobby(data) {
    // Retrieve variables from the passed data
    const timePerWord = data.timePerWord;
    const wordLength = data.wordLength;
    const wordAmt = data.wordAmt;
    const playerOne = data.playerOne;

    console.log(`Time Per Word: ${timePerWord} seconds`);
    console.log(`Word Length: ${wordLength} characters`);
    console.log(`Amount of Words: ${wordAmt}`);
    console.log(`Player One's Username: ${playerOne}`);

    let roomKey;
    let isUnique = false;

    // keep generating roomkeys until a unique key is generated
    while (!isUnique) {
        roomKey = generateRoomKey();
        const roomRef = db.collection('rooms').doc(roomKey);
        const doc = await roomRef.get();

        if (!doc.exists) {
            isUnique = true;
        }
    }

    // Once a unique key is found, create the document
    const roomRef = db.collection('rooms').doc(roomKey);
    await roomRef.set({
        timePerWord: timePerWord,
        wordLength: wordLength,
        wordAmt: wordAmt
    });

    // Add playerOne to the players collection with a document ID of 1, a field called "username", and the additional fields "score" and "guessCount"
    await roomRef.collection('players').doc('1').set({
        username: playerOne,
        score: 0,  // Initialize score to 0
        guessCount: 0  // Initialize guessCount to 0
    });

    console.log(`Room created with key: ${roomKey}`);
    return roomKey;
}

//export for use at server.js
module.exports = createLobby;