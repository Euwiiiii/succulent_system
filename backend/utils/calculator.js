/**
 * Calculates the final total cost and selling price of a product or arrangement.
 * 
 * @param {Object} data
 * @param {Array} data.plants - Array of plant objects { cost: Number }
 * @param {Object} data.pot - Selected Pot object { unitCost: Number }
 * @param {Number} data.potCost - Fallback manual pot cost
 * @param {Array} data.supplies - Array of supply objects { supply: { unitCost: Number }, gramsUsed: Number }
 * @param {Number} data.laborCost - Cost of labor
 * @param {Number} data.markupPercentage - Profit margin percentage
 * @param {String} data.type - 'Single Plant' or 'Arrangement'
 * @param {Number} data.costPrice - Base cost price for single plant (legacy/direct entry)
 * @param {Number} data.sellingPrice - Base selling price for single plant (legacy/direct entry)
 * @returns {Object} { totalCost: Number, sellingPrice: Number }
 */
const calculateFinalPrices = ({
    plants = [],
    pot = null,
    potCost = 0,
    supplies = [],
    laborCost = 0,
    markupPercentage = 0,
    type = 'Arrangement',
    costPrice = 0,
    sellingPrice = 0
}) => {
    // 1. Calculate sum of plant costs
    const totalPlantsCost = plants.reduce((sum, plant) => sum + (Number(plant.cost) || 0), 0);

    // 2. Calculate supplies cost
    const totalSuppliesCost = supplies.reduce((sum, item) => {
        const unitCost = item.supply?.unitCost || item.supply?.costPerGram || 0; // backward compat with costPerGram just in case
        const grams = Number(item.gramsUsed) || 0;
        return sum + (unitCost * grams);
    }, 0);

    const calculatedPotCost = (pot && pot.unitCost !== undefined) ? Number(pot.unitCost) : Number(potCost) || 0;
    const labor = Number(laborCost) || 0;
    const markup = Number(markupPercentage) || 0;
    
    let finalTotalCost = 0;
    let finalSellingPrice = 0;

    const baseCostForSinglePlant = Number(costPrice) || 0;

    if (type === 'Single Plant' && totalPlantsCost === 0 && calculatedPotCost === 0 && totalSuppliesCost === 0 && labor === 0) {
        // Pure single plant without added components
        finalTotalCost = baseCostForSinglePlant;
        finalSellingPrice = Number(sellingPrice) || 0;
    } else {
        // Arrangement or Single Plant with added components
        let baseCost = totalPlantsCost;
        if (totalPlantsCost === 0 && type === 'Single Plant') {
            baseCost = baseCostForSinglePlant;
        }
        
        finalTotalCost = baseCost + calculatedPotCost + totalSuppliesCost + labor;
        const profitAmount = finalTotalCost * (markup / 100);
        finalSellingPrice = finalTotalCost + profitAmount;
    }

    return {
        totalCost: finalTotalCost,
        sellingPrice: finalSellingPrice
    };
};

module.exports = { calculateFinalPrices };
