const client = require("../db/client");
require("../middlewares/dbfunctions")();


exports.CreateBillingAddresses = (req, res) => {
    const { fullName, addressLine, city, state, postalCode, country, phoneNumber, email, token } = req.body;
    if (!token, !fullName, !addressLine, !city, !state, !postalCode, !country, !phoneNumber, !email) {
        return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
    } else {
        getUserProfileFromToken(token, async (err, foundUser) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (foundUser) {
                const userId = foundUser.id;
                try {
                    const checkQuery = `INSERT INTO public.billing_addresses(
                                            "userId", "fullName", "addressLine", city, state, "postalCode", country, "phoneNumber", email)
	                                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`;
                    const checkValues = [userId, fullName, addressLine, city, state, postalCode, country, phoneNumber, email];
                    client.query(checkQuery, checkValues, async (err, result) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                        } else if (result.rowCount === 1) {
                            return res.status(201).json({ success: true, message: "Added", responsecode: 201 });
                        } else {
                            return res.status(409).json({ success: false, message: "Unable to Add", responsecode: 409 });
                        }
                    });
                } catch (error) {
                    return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
                }
            } else {
                return res.status(401).json({ success: false, message: "User not found or unauthorized", responsecode: 401 });
            }
        });
    }
};

exports.UpdateBillingAddresses = (req, res) => {
    const { fullName, addressLine, city, state, postalCode, country, phoneNumber, email, token, add_id } = req.body;
    if (!token, !fullName, !addressLine, !city, !state, !postalCode, !country, !phoneNumber, !email, !add_id) {
        return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
    } else {
        getUserProfileFromToken(token, async (err, foundUser) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (foundUser) {
                const userId = foundUser.id;
                try {
                    const checkQuery = `UPDATE public.billing_addresses
	                                    SET "fullName"=$1, "addressLine"=$2, city=$3, state=$4, "postalCode"=$5, country=$6, "phoneNumber"=$7, email=$8
	                                    WHERE "userId"=$9 and id=$10`;
                    const checkValues = [fullName, addressLine, city, state, postalCode, country, phoneNumber, email, userId, add_id];
                    client.query(checkQuery, checkValues, async (err, result) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                        } else if (result.rowCount === 1) {
                            return res.status(201).json({ success: true, message: "Updated", responsecode: 201 });
                        } else {
                            return res.status(409).json({ success: false, message: "Unable to Update", responsecode: 409 });
                        }
                    });
                } catch (error) {
                    return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
                }
            } else {
                return res.status(401).json({ success: false, message: "User not found or unauthorized", responsecode: 401 });
            }
        });
    }
};

exports.GetBillingAddresses = (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
    } else {
        getUserProfileFromToken(token, async (err, foundUser) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (foundUser) {
                const userId = foundUser.id;
                try {
                    const checkQuery = 'SELECT * FROM public.billing_addresses where "userId"=$1;';
                    const checkValues = [userId];
                    client.query(checkQuery, checkValues, async (err, result) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                        } else if (result.rowCount === 1) {
                            return res.status(201).json({ success: true, date: result.rows, responsecode: 201 });
                        } else {
                            return res.status(409).json({ success: false, message: "Unable to get", data: result.rows, responsecode: 409 });
                        }
                    });
                } catch (error) {
                    return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
                }
            } else {
                return res.status(401).json({ success: false, message: "User not found or unauthorized", responsecode: 401 });
            }
        });
    }
};