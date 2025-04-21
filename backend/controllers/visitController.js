const VisitCount = require('../models/VisitCount');

const getVisitCount = async (req, res) => {
  try {
    let visitCount = await VisitCount.findOne();
    if (!visitCount) {
      visitCount = new VisitCount({ count: 0 });
      await visitCount.save();
    }
    res.json({ count: visitCount.count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visit count', error });
  }
};

const incrementVisitCount = async (req, res) => {
  try {
    let visitCount = await VisitCount.findOne();
    if (!visitCount) {
      visitCount = new VisitCount({ count: 1 });
    } else {
      visitCount.count += 1;
    }
    await visitCount.save();
    res.json({ count: visitCount.count });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing visit count', error });
  }
};

module.exports = {
  getVisitCount,
  incrementVisitCount,
};
