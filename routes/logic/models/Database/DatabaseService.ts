const { Sequelize } = require('sequelize');

export const sequelize = new Sequelize(
    'SOAS_dev',
    'sa',
    'SOASemo%&1923!',
    {
        host: '192.168.79.138',
        dialect: 'mssql',
        // dialectOptions: {options: {encrypt: true}}
    });

export async function testConnection(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
