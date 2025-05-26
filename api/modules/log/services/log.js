const { getAllModels } = require("../../../middlewares/loadModels");

const create = async (type, payload) => {
  const { ErrorLog, AccessLog } = await getAllModels(process.env.DB_TYPE);
    if (type !== 'error' && type !== 'access') {   
        throw new Error('Invalid log type');
    }
  if (type === 'error') {
    return await ErrorLog.create({
      message: payload.message,
      error_type: payload.error_type,
      stack_trace: payload.stack_trace,
    });
  } else if (type === 'access') {
    return await AccessLog.create({
      user_id: payload.user_id,
      action: payload.action,
      ip_address: payload.ip_address,
      device_info: payload.device_info,
      timestamp: new Date(),
    });
  }
};

const findAll = async (type) => {
  const { ErrorLog, AccessLog } = await getAllModels(process.env.DB_TYPE);
    if (type !== 'error' && type !== 'access') {
        throw new Error('Invalid log type');
    }
  const model = type === 'error' ? ErrorLog : AccessLog;
  return await model.findAll({
    order: [['created_at' in model.rawAttributes ? 'created_at' : 'timestamp', 'DESC']],
  });
};


module.exports = {
    create,
    findAll
};