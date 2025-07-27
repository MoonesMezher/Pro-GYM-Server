const logger = require("../config/winston");
const Rate = require("../models/Rate");
const Section = require("../models/Section");

const handleAvgRate = async (sectionId) => {    
    try {
        const section = await Section.findById(sectionId);
        if (!section) return;
    
        // Get all ratings for this section
        const rates = await Rate.find({ _section: sectionId });
        
        // Calculate new average
        const total = rates.map(e => e.rate).reduce((sum, rate) => sum + rate, 0); 
        const newAvg = rates.length > 0 ? (total / rates.length).toFixed(1) : 0; 
        
        // Update section
        section.avgRate = parseFloat(newAvg);
        section.rateCount = rates.length;
    
        await section.save();
    } catch (error) {
        logger.error(error.messsage)
    }
}

module.exports = handleAvgRate

