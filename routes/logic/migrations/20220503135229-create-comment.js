'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      COMMENTS_ID: {
        type: Sequelize.NUMBER
      },
      CUSTOMERS_NUMBER: {
        type: Sequelize.STRING
      },
      CONNTACT_TYPE: {
        type: Sequelize.STRING
      },
      FIRST_CONNTACT_DATE: {
        type: Sequelize.DATE
      },
      COMMENTS_STATE: {
        type: Sequelize.NUMBER
      },
      ORDERS_NUMBER: {
        type: Sequelize.STRING
      },
      CUSTOMER_COMMENTS: {
        type: Sequelize.TEXT
      },
      AGENT_COMMENT: {
        type: Sequelize.TEXT
      },
      UPDATE_DATE: {
        type: Sequelize.DATE
      },
      RELATED: {
        type: Sequelize.NUMBER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};