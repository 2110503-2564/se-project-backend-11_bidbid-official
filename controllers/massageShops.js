const MassageShop = require('../models/MassageShop');
const Reservation = require('../models/Reservation');

//@desc Get all massage shops
//@route GET /api/v1/massageShops
//@access Public
exports.getMassageShops = async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };
    console.log(reqQuery);

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    // Create query string 
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = MassageShop.find(JSON.parse(queryStr)).populate('reservations');

    console.log(query);

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const total = await MassageShop.countDocuments();
        query = query.skip(startIndex).limit(limit);

        // Execute query
        const massageShops = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        res.status(200).json({ success: true, count: massageShops.length, data: massageShops });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};

//@desc Get a single massage shop
//@route GET /api/v1/massageShops/:id
//@access Public
exports.getMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.findById(req.params.id);

        if (!massageShop) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: massageShop });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc Create a new massage shop
//@route POST /api/v1/massageShops
//@access Private
exports.createMassageShop = async (req, res, next) => {
    // console.log(req.body);
    const massageShop = await MassageShop.create(req.body);-
    res.status(201).json({ success: true, data: massageShop });
};

//@desc Update a massage shop
//@route PUT /api/v1/massageShops/:id
//@access Private
exports.updateMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!massageShop) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: massageShop });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc Delete a massage shop
//@route DELETE /api/v1/massageShops/:id
//@access Private
exports.deleteMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.findByIdAndDelete(req.params.id);

        if (!massageShop) {
            return res.status(404).json({ success: false, message: `Massage shop not found with id of ${req.params.id}` });
        }
        await Reservation.deleteMany({ massageShop: req.params.id });
        await MassageShop.deleteOne({ _id: req.params.id });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
