const db = require('../database'); // Shared DB instance
const { runQuery, getQuery, allQuery } = require('../utils/dbHelpers'); // Import helpers

// TODO: Implement actual availability logic for tables/sunbeds
// TODO: Integrate JWT authentication: user_id should come from req.user.id
// TODO: Implement role-based access for fetching/updating/deleting reservations

const createReservation = async (req, res) => {
    let { user_id, type, reservation_date, reservation_time, num_people, sunbed_type } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: 'user_id is required.' });
    }
    if (!type || !reservation_date || !reservation_time && type === 'table') { // time is only strictly required for table
        return res.status(400).json({ message: 'Type, reservation_date, and reservation_time (for table) are required.' });
    }
     if (!type || !reservation_date && type === 'sunbed') { // time is not required for sunbed
        return res.status(400).json({ message: 'Type and reservation_date are required for sunbed.' });
    }


    if (type !== 'table' && type !== 'sunbed') {
        return res.status(400).json({ message: "Type must be 'table' or 'sunbed'." });
    }

    if (type === 'table' && (num_people === undefined || num_people === null || num_people < 1)) {
        return res.status(400).json({ message: 'Number of people (num_people) is required for table reservations and must be at least 1.' });
    } else if (type === 'table') {
        sunbed_type = null;
    }

    if (type === 'sunbed' && !sunbed_type) {
        return res.status(400).json({ message: 'Sunbed type (sunbed_type) is required for sunbed reservations.' });
    } else if (type === 'sunbed') {
        num_people = null;
        reservation_time = reservation_time || 'All Day'; // Default time for sunbeds if not provided
    }

    const sql = `INSERT INTO reservations (user_id, type, reservation_date, reservation_time, num_people, sunbed_type)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    try {
        const result = await runQuery(db, sql, [user_id, type, reservation_date, reservation_time, num_people, sunbed_type]);
        const createdReservation = await getQuery(db, 'SELECT * FROM reservations WHERE id = ?', [result.lastID]);
        res.status(201).json(createdReservation);
    } catch (error) {
        console.error('Error creating reservation:', error.message);
        res.status(500).json({ message: 'Server error creating reservation.', error: error.message });
    }
};

const getReservations = async (req, res) => {
    const { user_id, type } = req.query;
    let sql = 'SELECT * FROM reservations';
    const params = [];
    const conditions = [];

    if (user_id) {
        conditions.push('user_id = ?');
        params.push(user_id);
    }
    if (type) {
        if (type !== 'table' && type !== 'sunbed') {
            return res.status(400).json({ message: "Type query parameter must be 'table' or 'sunbed'."});
        }
        conditions.push('type = ?');
        params.push(type);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
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
    const sql = 'SELECT * FROM reservations WHERE id = ?';
    try {
        const reservation = await getQuery(db, sql, [id]);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }
        res.status(200).json(reservation);
    } catch (error) {
        console.error('Error fetching reservation by ID:', error.message);
        res.status(500).json({ message: 'Server error fetching reservation.', error: error.message });
    }
};

const updateReservation = async (req, res) => {
    const { id } = req.params;
    const { user_id, type, reservation_date, reservation_time, num_people, sunbed_type } = req.body;

    if (!type && !reservation_date && !reservation_time && !num_people && !sunbed_type && !user_id) {
        return res.status(400).json({ message: 'At least one field must be provided for update.' });
    }
    if (type && type !== 'table' && type !== 'sunbed') {
        return res.status(400).json({ message: "Type must be 'table' or 'sunbed'." });
    }
    // ... (other validations can be more specific based on what's being updated)

    try {
        const existingReservation = await getQuery(db, 'SELECT * FROM reservations WHERE id = ?', [id]);
        if (!existingReservation) {
            return res.status(404).json({ message: 'Reservation not found to update.' });
        }

        const new_user_id = user_id !== undefined ? user_id : existingReservation.user_id;
        let new_type = type !== undefined ? type : existingReservation.type;
        const new_reservation_date = reservation_date !== undefined ? reservation_date : existingReservation.reservation_date;
        let new_reservation_time = reservation_time !== undefined ? reservation_time : existingReservation.reservation_time;

        let new_num_people = num_people !== undefined ? num_people : existingReservation.num_people;
        let new_sunbed_type = sunbed_type !== undefined ? sunbed_type : existingReservation.sunbed_type;

        if (new_type === 'table') {
            if (new_num_people === undefined || new_num_people === null || new_num_people < 1) {
                 // If type is changing to 'table' or already 'table', num_people must be valid
                 if(type || existingReservation.type === 'table'){ // check if type is explicitly set or was already table
                    return res.status(400).json({ message: 'Number of people (num_people) is required and must be at least 1 for table reservations.' });
                 }
            }
            new_sunbed_type = null;
            if(new_reservation_time === undefined && (type || existingReservation.type === 'table')) { // if type is table, time is required
                 return res.status(400).json({ message: 'Reservation time is required for table reservations.'});
            }
        } else if (new_type === 'sunbed') {
             if (new_sunbed_type === undefined || new_sunbed_type === null || new_sunbed_type === '') {
                 if(type || existingReservation.type === 'sunbed'){
                    return res.status(400).json({ message: 'Sunbed type (sunbed_type) is required for sunbed reservations.' });
                 }
            }
            new_num_people = null;
            new_reservation_time = new_reservation_time || 'All Day'; // Default if not provided for sunbed
        }

        const sql_update = `UPDATE reservations SET
                        user_id = ?, type = ?, reservation_date = ?, reservation_time = ?,
                        num_people = ?, sunbed_type = ?
                     WHERE id = ?`;
        await runQuery(db, sql_update, [new_user_id, new_type, new_reservation_date, new_reservation_time, new_num_people, new_sunbed_type, id]);

        const updatedReservation = await getQuery(db, 'SELECT * FROM reservations WHERE id = ?', [id]);
        res.status(200).json(updatedReservation);
    } catch (error) {
        console.error('Error updating reservation:', error.message);
        res.status(500).json({ message: 'Server error updating reservation.', error: error.message });
    }
};

const deleteReservation = async (req, res) => {
    const { id } = req.params;
    try {
        const existingReservation = await getQuery(db, 'SELECT * FROM reservations WHERE id = ?', [id]);
        if (!existingReservation) {
            return res.status(404).json({ message: 'Reservation not found to delete.' });
        }
        const sql_delete = 'DELETE FROM reservations WHERE id = ?';
        const result = await runQuery(db, sql_delete, [id]);

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Reservation not found or no changes made.' });
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
