import firebase from "firebase/app";
import { firestore as db } from "./init";
import { storage } from "./init";

export default class dbHelper {
  /**
   * Gets document from firestore.
   * If no `id` is provided, it will parse `collection` and take last token after '/'.
   * @example getDocFromCollection('users/1')
   * @example getDocFromCollection('users', 1)
   * @param {string} collection path in Firebase Firestore
   * @param {string} id document identifier
   */
  static async getDocFromCollection(collection, id) {
    const docId = id;
    const docRef = db.collection(collection);
    const res = await docRef
      .doc(docId)
      .get()
      .then((doc) => {
        if (doc && doc.exists && doc.data && doc.id) {
          const result = doc.data();
          result["id"] = doc.id;
          return result;
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return res;
  }

  static async getAllDataFromCollection(
    collection,
    orderBy = {
      field: firebase.firestore.FieldPath.documentId(),
      direction: "asc",
    }
  ) {
    const returnArray = [];
    const docRef = db
      .collection(collection)
      .orderBy(orderBy.field, orderBy.direction);
    await docRef
      .get()
      .then(function (snapshot) {
        snapshot.forEach(function (doc) {
          if (doc && doc.exists && doc.data && doc.id) {
            const result = doc.data();
            result["id"] = doc.id;
            returnArray.push(result);
          }
        });
      })
      .catch((e) => {
        const error = "getAllDataFromCollection - " + collection + " - " + e;
        console.error(error);
      });
    return returnArray;
  }

  static async setDataToCollection(collection, id, data) {
    return await db
      .collection(collection)
      .doc(id)
      .set(data)
      .catch((e) => {
        const error =
          "setDataToCollection - " + collection + " - " + id + " - " + e;
        console.error(error);
      });
  }

  static async addDataToCollection(collection, data) {
    return await db
      .collection(collection)
      .add(data)
      .catch((e) => {
        const error = "addDataToCollection - " + collection + " - " + e;
        console.error(error);
      });
  }

  static async updateDataToCollection(collection, id, data) {
    return await db
      .collection(collection)
      .doc(id)
      .update(data)
      .catch((e) => {
        const error =
          "updateDataToCollection - " + collection + " - " + id + " - " + e;
        console.error(error);
      });
  }

  static getRTDataFromCollection(collection, id, callback) {
    db.collection(collection)
      .doc(id)
      .onSnapshot((doc) => {
        callback(doc);
      });
  }
  static async addAvatarToStorage(user, image) {
    const snapshot = await storage
      .ref(`images/${user}/${image.name}`)
      .put(image);
    return await snapshot.ref.getDownloadURL();
  }
  static async addImageToStorage(user, image) {
    const userData = await this.getDocFromCollection("users", user);
    const images = userData?.images || [];
    const snapshot = await storage
      .ref(`images/${user}/${image.name}`)
      .put(image);
    return await snapshot.ref.getDownloadURL();
  }
  static async updatePhotoEventToStorage(user, image, eventID) {
    return await storage
      .ref(`images/events/${user}/${image.name}`)
      .put(image)
      .then((snapshot) =>
        snapshot?.ref
          ?.getDownloadURL()
          .then((url) =>
            this.updateDataToCollection("events", eventID, { photo: url })
          )
      );
  }

  static updatePhotoArtistToStorage(user, artists, eventID) {
    artists.forEach(async (artist) => {
      return await storage
        .ref(`images/events/${user}/artists/${artist.photo.name}`)
        .put(artist.photo)
        .then((snapshot) =>
          snapshot?.ref?.getDownloadURL().then((url) =>
            this.updateDataToCollection("events", eventID, {
              artists: firebase.firestore.FieldValue.arrayUnion({
                name: artist.name,
                photo: url,
              }),
            })
          )
        );
    });
  }
}
