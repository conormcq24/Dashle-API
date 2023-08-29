const admin = require('firebase-admin');
const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH);
const crypto = require('crypto');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

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
    console.log(`Player Ones Username: ${playerOne}`);

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
    await db.collection('rooms').doc(roomKey).set({
        timePerWord: timePerWord,
        wordLength: wordLength,
        wordAmt: wordAmt,
	playerOne: playerOne
    });

    console.log(`Room created with key: ${roomKey}`);
}

module.exports = createLobby;