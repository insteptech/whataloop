"use strict";

const { supportedDbTypes } = require("../utils/staticData");
const { getAllModels } = require("../../../middlewares/loadModels");
const tableName = "Constants";
const constantData = [
  {
    id: 'fb5a2cb5-10ef-40d3-949c-19affe07c9f9',
    label: "Hot",
    value: "hot",
    type: "tag",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
   {
    id: '954054ff-fb39-4430-a95f-fb83b1a2dec9',
    label: "Cold",
    value: "cold",
    type: "tag",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 'a7086aa5-1a36-4b84-9691-1e98cdedfb8a',
    label: "Paid",
    value: "paid",
    type: "tag",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    
     {
    id: '79f22dd7-7714-4d0f-8ceb-369d8bc6457a',
    label: "New",
    value: "new",
    type: "status",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
       {
    id: 'bee0e609-ddc1-4c77-8bfd-b0d8ba8d6e07',
    label: "In-Progress",
    value: "inprogress",
    type: "status",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
         {
    id: '769cf1ba-1d56-49a3-be6c-9019b8c06649',
    label: "Closed",
    value: "closed",
    type: "status",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
         
          {
    id: 'af4521e1-8844-493f-b71c-d443d3059022',
    label: "Pending",
    value: "pending",
    type: "status",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
           {
    id: '2f7db692-be04-4144-9670-3d4423c5e481',
    label: "Done",
    value: "done",
    type: "status",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
            {
    id: '9400230d-eafd-4a00-8a0e-590c3e2d81f7',
    label: "Missed",
    value: "missed",
    type: "status",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
            
                {
    id: '3bb69455-62e6-44a8-b9d0-75360334a610',
    label: "Whats-App",
    value: "whatsapp",
    type: "source",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
       {
    id: '370c8e3a-4494-4d69-9447-1f703df215ac',
    label: "Manual",
    value: "manual",
    type: "source",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
             {
    id: 'ecc7d736-07d2-4549-a3b6-3838253f9452',
    label: "Facebook",
    value: "facebook",
    type: "source",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  async up(queryInterface) {
    const { Constant, sequelize } = await getAllModels(process.env.DB_TYPE);
 
    const transaction = await sequelize.transaction();
    try {
      if (process.env.DB_TYPE === supportedDbTypes.mssql)
        await queryInterface.sequelize.query(
          `SET IDENTITY_INSERT ${tableName} ON`,
          { transaction }
        );

      await Constant.bulkCreate(constantData, { transaction });
      if (process.env.DB_TYPE === supportedDbTypes.mssql)
        await queryInterface.sequelize.query(
          `SET IDENTITY_INSERT  ${tableName} OFF`,
          { transaction }
        );
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction in case of an error
      console.error("Error creating Constant:", error);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
