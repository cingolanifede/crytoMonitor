module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_KEY: process.env.JWT_KEY || 'wolox',
    JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',
    JWT_LIFETIME: process.env.JWT_LIFETIME || 86400,
    MONGODB_HOST: process.env.SERVER || 'localhost',
    MONGODB_DATABASE: process.env.DBNAME || 'crypto',
    MONGODB_DATABASE_PORT: process.env.DBPORT || 27017
};