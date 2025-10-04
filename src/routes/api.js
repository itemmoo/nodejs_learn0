const express = require('express');
const router = express.Router();

// API routes
router.get('/users', (req, res) => {
    res.json({ 
        users: [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Smith' }
        ]
    });
});

router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ 
        user: { id: userId, name: `User ${userId}` }
    });
});

module.exports = router;