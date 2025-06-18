
"use strict"

/**
 * DynamicPricing provides dynamic pricing strategies for various industries such as retail, SaaS, airlines, gig economy, and energy.
 * 
 * @class
 * @classdesc
 * This class offers methods to calculate prices based on different market factors like demand, supply, competitor prices, user growth, urgency, and environmental factors.
 * It supports industry-specific pricing models and a general pricing formula.
 *
 * @example
 * const pricing = new DynamicPricing(100);
 * const price = pricing.calculatePrice('retail', { demand: 50, supply: 30, maxSupply: 100, competitorPrice: 95 });
 */
class DynamicPricing {
    constructor(basePrice) {
        this.basePrice = basePrice; // Base price of the product/service
    }

    /**
     * Calculates the general pricing based on demand, supply, maximum supply, and sensitivity.
     *
     * @param {number} demand - The current demand for the item.
     * @param {number} supply - The current supply of the item.
     * @param {number} maxSupply - The maximum possible supply of the item.
     * @param {number} [sensitivity=0.5] - The sensitivity factor for price adjustment.
     * @returns {number} The calculated price based on the provided parameters.
     */
    generalPricing(demand, supply, maxSupply, sensitivity = 0.5) {
        return this.basePrice * (1 + ((demand - supply) / maxSupply) * sensitivity);
    }

    /**
     * Calculates the retail price based on demand, supply, maximum supply, competitor price, and sensitivity.
     *
     * @param {number} demand - The current demand for the product.
     * @param {number} supply - The current supply of the product.
     * @param {number} maxSupply - The maximum possible supply of the product.
     * @param {number} competitorPrice - The price set by a competitor.
     * @param {number} [sensitivity=0.5] - The sensitivity factor for price adjustment.
     * @returns {number} The calculated retail price.
     */
    retailPricing(demand, supply, maxSupply, competitorPrice, sensitivity = 0.5) {
        const competitiveFactor = competitorPrice / this.basePrice;
        return this.basePrice * (1 + ((demand - supply) / maxSupply) * sensitivity) * competitiveFactor;
    }

    /**
     * Calculates the SaaS pricing based on user growth, lifetime value, and acquisition cost.
     *
     * @param {number} newUsers - The number of new users acquired.
     * @param {number} lostUsers - The number of users lost.
     * @param {number} totalUsers - The total number of users.
     * @param {number} lifetimeValue - The average lifetime value of a user.
     * @param {number} acquisitionCost - The cost to acquire a new user.
     * @param {number} [sensitivity=0.5] - The sensitivity factor for pricing adjustment.
     * @returns {number} The calculated SaaS price.
     */
    saasPricing(newUsers, lostUsers, totalUsers, lifetimeValue, acquisitionCost, sensitivity = 0.5) {
        const growthFactor = (newUsers - lostUsers) / totalUsers;
        const LTVFactor = lifetimeValue / acquisitionCost;
        return this.basePrice * (1 + growthFactor * sensitivity) * LTVFactor;
    }

    /**
     * Calculates the dynamic airline ticket price based on seats sold, availability, and time left.
     *
     * @param {number} seatsSold - The number of seats that have already been sold.
     * @param {number} seatsAvailable - The number of seats currently available for sale.
     * @param {number} totalSeats - The total number of seats on the flight.
     * @param {number} timeLeft - The amount of time left (in the same units as maxTime) before the flight departs.
     * @param {number} maxTime - The maximum time window for ticket sales (e.g., total time from ticket release to departure).
     * @param {number} [sensitivity=0.5] - A factor that adjusts how sensitive the price is to seat availability.
     * @returns {number} The dynamically calculated ticket price.
     */
    airlinePricing(seatsSold, seatsAvailable, totalSeats, timeLeft, maxTime, sensitivity = 0.5) {
        const timeUrgency = (maxTime - timeLeft) / maxTime;
        return this.basePrice * (1 + ((seatsSold - seatsAvailable) / totalSeats) * sensitivity) * (1 + timeUrgency);
    }

    /**
     * Calculates the gig pricing based on current demand, worker availability, and urgency.
     *
     * @param {number} activeRequests - The number of active requests.
     * @param {number} availableWorkers - The number of available workers.
     * @param {number} maxWorkers - The maximum number of workers.
     * @param {number} [urgencyFactor=1.2] - A multiplier to adjust price based on urgency.
     * @param {number} [sensitivity=0.5] - Sensitivity factor for price adjustment.
     * @returns {number} The calculated price for the gig.
     */
    gigPricing(activeRequests, availableWorkers, maxWorkers, urgencyFactor = 1.2, sensitivity = 0.5) {
        return this.basePrice * (1 + ((activeRequests - availableWorkers) / maxWorkers) * sensitivity) * urgencyFactor;
    }

    /**
     * Calculates the dynamic energy price based on demand, supply, maximum supply, 
     * environmental factors, and sensitivity.
     *
     * @param {number} demand - The current energy demand.
     * @param {number} supply - The current energy supply.
     * @param {number} maxSupply - The maximum possible energy supply.
     * @param {number} [environmentalFactor=1.1] - A multiplier reflecting environmental impact.
     * @param {number} [sensitivity=0.5] - Sensitivity factor for price adjustment.
     * @returns {number} The calculated energy price.
     */
    energyPricing(demand, supply, maxSupply, environmentalFactor = 1.1, sensitivity = 0.5) {
        return this.basePrice * (1 + ((demand - supply) / maxSupply) * sensitivity) * environmentalFactor;
    }

    /**
     * Calculates the price based on the specified industry and parameters.
     *
     * @param {string} industry - The industry type (e.g., 'retail', 'saas', 'airline', 'gig', 'energy').
     * @param {Object} params - The parameters required for the pricing calculation, which vary by industry:
     *   @param {number} [params.demand] - Demand value (used in 'retail' and 'energy').
     *   @param {number} [params.supply] - Supply value (used in 'retail' and 'energy').
     *   @param {number} [params.maxSupply] - Maximum supply (used in 'retail', 'energy', and default).
     *   @param {number} [params.competitorPrice] - Competitor price (used in 'retail').
     *   @param {number} [params.sensitivity] - Sensitivity factor (used in all industries).
     *   @param {number} [params.newUsers] - Number of new users (used in 'saas').
     *   @param {number} [params.lostUsers] - Number of lost users (used in 'saas').
     *   @param {number} [params.totalUsers] - Total number of users (used in 'saas').
     *   @param {number} [params.lifetimeValue] - Customer lifetime value (used in 'saas').
     *   @param {number} [params.acquisitionCost] - Customer acquisition cost (used in 'saas').
     *   @param {number} [params.seatsSold] - Number of seats sold (used in 'airline').
     *   @param {number} [params.seatsAvailable] - Number of seats available (used in 'airline').
     *   @param {number} [params.totalSeats] - Total number of seats (used in 'airline').
     *   @param {number} [params.timeLeft] - Time left until departure (used in 'airline').
     *   @param {number} [params.maxTime] - Maximum time window (used in 'airline').
     *   @param {number} [params.activeRequests] - Number of active gig requests (used in 'gig').
     *   @param {number} [params.availableWorkers] - Number of available workers (used in 'gig').
     *   @param {number} [params.maxWorkers] - Maximum number of workers (used in 'gig').
     *   @param {number} [params.urgencyFactor] - Urgency factor (used in 'gig').
     *   @param {number} [params.environmentalFactor] - Environmental factor (used in 'energy').
     * @returns {number} The calculated price for the given industry and parameters.
     */
    calculatePrice(industry, params) {
        switch (industry) {
            case 'retail':
                return this.retailPricing(params.demand, params.supply, params.maxSupply, params.competitorPrice, params.sensitivity);
            case 'saas':
                return this.saasPricing(params.newUsers, params.lostUsers, params.totalUsers, params.lifetimeValue, params.acquisitionCost, params.sensitivity);
            case 'airline':
                return this.airlinePricing(params.seatsSold, params.seatsAvailable, params.totalSeats, params.timeLeft, params.maxTime, params.sensitivity);
            case 'gig':
                return this.gigPricing(params.activeRequests, params.availableWorkers, params.maxWorkers, params.urgencyFactor, params.sensitivity);
            case 'energy':
                return this.energyPricing(params.demand, params.supply, params.maxSupply, params.environmentalFactor, params.sensitivity);
            default:
                return this.generalPricing(params.demand, params.supply, params.maxSupply, params.sensitivity);
        }
    }
}

module.exports = DynamicPricing;
