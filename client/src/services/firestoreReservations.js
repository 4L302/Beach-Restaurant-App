// src/services/firestoreReservations.js
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

// Riferimento alla collection "reservations"
const reservationsCollection = collection(db, 'reservations');

/**
 * Recupera tutte le prenotazioni di un utente ordinate per data (più recenti prima).
 * @param {string} userId - ID dell'utente
 * @returns {Promise<Array>} lista di prenotazioni
 */
export const getUserReservations = async (userId) => {
  try {
    const q = query(
      reservationsCollection,
      where('userId', '==', userId),
      orderBy('reservation_date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const reservations = [];

    querySnapshot.forEach((doc) => {
      reservations.push({ id: doc.id, ...doc.data() });
    });

    return reservations;
  } catch (error) {
    console.error('Errore nel recupero prenotazioni:', error);
    throw error;
  }
};

/**
 * Aggiunge una nuova prenotazione.
 * @param {Object} reservationData - dati prenotazione
 * @returns {Promise<string>} ID nuova prenotazione
 */
export const addReservation = async (reservationData) => {
  try {
    const docRef = await addDoc(reservationsCollection, reservationData);
    return docRef.id;
  } catch (error) {
    console.error('Errore nell\'aggiunta prenotazione:', error);
    throw error;
  }
};

/**
 * Elimina una prenotazione per ID.
 * @param {string} reservationId - ID della prenotazione da eliminare
 * @returns {Promise<void>}
 */
export const deleteReservation = async (reservationId) => {
  try {
    const docRef = doc(db, 'reservations', reservationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Errore nell\'eliminazione prenotazione:', error);
    throw error;
  }
};

/**
 * Aggiorna i dati di una prenotazione esistente.
 * @param {string} reservationId - ID della prenotazione da aggiornare
 * @param {Object} updatedData - dati aggiornati
 * @returns {Promise<void>}
 */
export const updateReservation = async (reservationId, updatedData) => {
  try {
    const docRef = doc(db, 'reservations', reservationId);
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error('Errore nell\'aggiornamento prenotazione:', error);
    throw error;
  }
};
