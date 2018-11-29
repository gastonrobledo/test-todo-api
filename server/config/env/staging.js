export const config = {
    db: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://localhost/medable-api',
};
