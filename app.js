const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Import routes
const indexRoutes = require('./src/routes/index');
const apiRoutes = require('./src/routes/api');

// Middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Routes
app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(port, () => {
    debug(chalk.red(`Server is running at http://localhost:${port}`));
});
