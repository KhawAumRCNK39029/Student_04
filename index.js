const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware to set custom headers
app.use((req, res, next) => {
    // Check if limiter.options is defined
    if (limiter.options) {
        res.setHeader('X-RateLimit-Limit', limiter.options.max);
        res.setHeader('X-RateLimit-Remaining', req.rateLimit.remaining);
        res.setHeader('X-RateLimit-Reset', Math.ceil(req.rateLimit.resetTime / 1000));
    }
    next();
});

app.get('/', (req, res) => {
    // Log rate limit status
    console.log(`Rate limit remaining: ${req.rateLimit.remaining} requests`);
    console.log(`Rate limit reset in: ${Math.ceil(req.rateLimit.resetTime / 1000)} seconds`);

    // Send rate limit information and message with HTML line breaks
    res.send(`Rate limit remaining: ${req.rateLimit.remaining} requests<br>` +
             `Rate limit reset in: ${Math.ceil(req.rateLimit.resetTime / 1000)} seconds<br><br>` +
             `Hello, world! My name is Ratchaneekorn Weerasin`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
