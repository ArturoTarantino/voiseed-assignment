import { openDB } from 'idb';

const openDatabase = async () => {

    return await openDB('videoDatabase', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('videos')) {
                db.createObjectStore('videos', { keyPath: 'id' });
            }
        }
    });
};

export const saveVideoToIndexedDB = async (fileBlob: Blob) => {

    await clearDatabase();

    const db = await openDatabase();

    const transaction = db.transaction('videos', 'readwrite');
    const store = transaction.objectStore('videos');

    const videoData = {
        id: 1, // Force id 1 for demo purposes
        data: fileBlob,
        timestamp: Date.now(),
    };

    try {
        await store.add(videoData);
    } catch (error) {
        console.error("Error saving the video:", error);
        throw error;
    }
}

const clearDatabase = async () => {

    const db = await openDatabase();
    const transaction = db.transaction('videos', 'readwrite');
    const store = transaction.objectStore('videos');

    try {
        await store.clear();
    } catch (error) {
        console.error("Error clearing the database:", error);
        throw error;
    }
};

export const getVideoFromIndexedDB = async () => {

    const db = await openDatabase();
    const transaction = db.transaction('videos', 'readonly');
    const store = transaction.objectStore('videos');

    try {

        const videoData = await store.get(1);
        return videoData ? videoData.data : null;

    } catch (error) {
        console.error("Error retrieving video from IndexedDB:", error);
        throw error;
    }
};

export const clearAllData = async () => {

    localStorage.clear();
    sessionStorage.clear();

    const db = await openDB('videoDatabase');
    db.close();

    indexedDB.deleteDatabase('videoDatabase');
};