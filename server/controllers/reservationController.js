const db = require('../database'); // Shared DB instance
const { runQuery, getQuery, allQuery } = require('../utils/dbHelpers'); // Import helpers

// TODO: Implement detailed availability logic. This should consider:
// 1. Restaurant operating hours.
// 2. Capacity for table types / number of sunbeds.
// 3. Existing reservations for the requested date/time slot.
// 4. Potentially, buffer times between reservations.
// 5. This check needs to be integrated into createReservation and updateReservation.
// TODO: Implement role-based access for fetching/updating/deleting reservations (admin override)

// Helper function for validating reservation data
const getReservationValidationIssue = (data) => {
    const { type, reservation_date, reservation_time, num_people, sunbed_type } = data;

    if (!type || !reservation_date) {
        return 'Type and reservation_date are required.';
    }
    if (type !== 'table' && type !== 'sunbed') {
        return "Type must be 'table' or 'sunbed'.";
    }

    if (type === 'table') {
        if (!reservation_time) {
            return 'Reservation_time is required for table reservations.';
        }
        if (num_people === undefined || num_people === null || parseInt(num_people, 10) < 1) {
            return 'Number of people (num_people) must be a positive integer (>= 1) for table reservations.';
        }
    } else if (type === 'sunbed') {
        if (!sunbed_type) {
            return 'Sunbed type (sunbed_type) is required for sunbed reservations.';
        }
    }
    return null; // No validation issues
};


const createReservation = async (req, res) => {
    let { type, reservation_date, reservation_time, num_people, sunbed_type } = req.body;
    const userIdFromToken = req.user.userId;

    if (!userIdFromToken) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Initial data for validation
    const validationData = { type, reservation_date, reservation_time, num_people, sunbed_type };
    const validationError = getReservationValidationIssue(validationData);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    // Adjust data based on type AFTER validation
    if (type === 'table') {
        sunbed_type = null;
    } else if (type === 'sunbed') {
        num_people = null;
        reservation_time = reservation_time || 'All Day';
    }

    // TODO: Check for availability before creating the reservation
    // const isAvailable = await checkAvailability({ type, reservation_date, reservation_time, num_people, sunbed_type /*, existing_reservation_id: null for create */ });
    // if (!isAvailable) {
    //   return res.status(409).json({ message: 'The selected time/slot is not available.' });
    // }

    const sql = `INSERT INTO reservations (user_id, type, reservation_date, reservation_time, num_people, sunbed_type)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    try {
        const result = await runQuery(db, sql, [userIdFromToken, type, reservation_date, reservation_time, num_people, sunbed_type]);
        const createdReservation = await getQuery(db, 'SELECT * FROM reservations WHERE id = ?', [result.lastID]);
        res.status(201).json(createdReservation);
    } catch (error) {
        console.error('Error creating reservation:', error.message);
        res.status(500).json({ message: 'Server error creating reservation.', error: error.message });
    }
};

const getReservations = async (req, res) => {
    const userIdFromToken = req.user.userId;
    const { type } = req.query;

    let sql = 'SELECT * FROM reservations WHERE user_id = ?';
    const params = [userIdFromToken];

    if (type) {
        if (type !== 'table' && type !== 'sunbed') {
            return res.status(400).json({ message: "Type query parameter must be 'table' or 'sunbed'."});
        }
        sql += ' AND type = ?';
        params.push(type);
    }

    try {
        const reservations = await allQuery(db, sql, params);
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error.message);
        res.status(500).json({ message: 'Server error fetching reservations.', error: error.message });
    }
};

const getReservationById = async (req, res) => {
    const { id } = req.params;
    const userIdFromToken = req.user.userId;
    const sql = 'SELECT * FROM reservations WHERE id = ?';
    try {
        const reservation = await getQuery(db, sql, [id]);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }
        if (reservation.user_id !== userIdFromToken) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }
        res.status(200).json(reservation);
    } catch (error) {
        console.error('Error fetching reservation by ID:', error.message);
        res.status(500).json({ message: 'Server error fetching reservation.', error: error.message });
    }
};

const updateReservation = async (req, res) => {
    const { id } = req.params; // Reservation ID
    const userIdFromToken = req.user.userId;
    const bodyData = req.body;

    if (Object.keys(bodyData).length === 0) {
        return res.status(400).json({ message: 'At least one field must be provided for update.' });
    }
    if (bodyData.user_id !== undefined) {
        return res.status(400).json({ message: 'Cannot change ownership (user_id) of a reservation.' });
    }

    try {
        const existingReservation = await getQuery(db, 'SELECT * FROM reservations WHERE id = ?', [id]);
        if (!existingReservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }
        if (existingReservation.user_id !== userIdFromToken) {
            return res.status(404).json({ message: 'Reservation not found.' }); // Or 403 Forbidden
        }

        // Construct the full updatedData object
        const updatedData = {
            type: bodyData.type !== undefined ? bodyData.type : existingReservation.type,
            reservation_date: bodyData.reservation_date !== undefined ? bodyData.reservation_date : existingReservation.reservation_date,
            reservation_time: bodyData.reservation_time !== undefined ? bodyData.reservation_time : existingReservation.reservation_time,
            num_people: bodyData.num_people !== undefined ? bodyData.num_people : existingReservation.num_people,
            sunbed_type: bodyData.sunbed_type !== undefined ? bodyData.sunbed_type : existingReservation.sunbed_type,
        };

        // Explicitly set fields to null or default based on the *final* type
        if (updatedData.type === 'table') {
            updatedData.sunbed_type = null;
        } else if (updatedData.type === 'sunbed') {
            updatedData.num_people = null;
            // Only default reservation_time if it was not provided in body and is falsey from existing
            if (bodyData.reservation_time === undefined && !existingReservation.reservation_time) {
                 updatedData.reservation_time = 'All Day';
            } else if (bodyData.reservation_time === null || bodyData.reservation_time === '') { // if explicitly set to null or empty
                 updatedData.reservation_time = 'All Day';
            }
        }

        const validationError = getReservationValidationIssue(updatedData);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // TODO: Check for availability before updating the reservation, especially if date/time/type/num_people changed.
        // Pass existingReservation.id to exclude it from conflict checks if a simple time slot change.
        // const isAvailable = await checkAvailability({ ...updatedData, existing_reservation_id: existingReservation.id });
        // if (!isAvailable) {
        //   return res.status(409).json({ message: 'The new selected time/slot is not available.' });
        // }

        const sql_update = `UPDATE reservations SET
                        type = ?, reservation_date = ?, reservation_time = ?,
                        num_people = ?, sunbed_type = ?
                     WHERE id = ? AND user_id = ?`;
        await runQuery(db, sql_update, [
            updatedData.type,
            updatedData.reservation_date,
            updatedData.reservation_time,
            updatedData.num_people,
            updatedData.sunbed_type,
            id,
            userIdFromToken
        ]);

        const finalUpdatedReservation = await getQuery(db, 'SELECT * FROM reservations WHERE id = ?', [id]);
        res.status(200).json(finalUpdatedReservation);
    } catch (error) {
        console.error('Error updating reservation:', error.message);
        res.status(500).json({ message: 'Server error updating reservation.', error: error.message });
    }
};

const deleteReservation = async (req, res) => {
    const { id } = req.params;
    const userIdFromToken = req.user.userId;
    try {
        const existingReservation = await getQuery(db, 'SELECT user_id FROM reservations WHERE id = ?', [id]);
        if (!existingReservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }
        if (existingReservation.user_id !== userIdFromToken) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        const sql_delete = 'DELETE FROM reservations WHERE id = ? AND user_id = ?';
        const result = await runQuery(db, sql_delete, [id, userIdFromToken]);

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Reservation not found or not authorized to delete.' });
        }
        res.status(200).json({ message: 'Reservation deleted successfully.' });
    } catch (error) {
        console.error('Error deleting reservation:', error.message);
        res.status(500).json({ message: 'Server error deleting reservation.', error: error.message });
    }
};

module.exports = {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation
};
