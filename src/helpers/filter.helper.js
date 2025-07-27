const filterQuery = (query, allowedFields = []) => {
    const queryObj = { ...query };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'search', "role"];
    
    // Remove special fields from query
    excludedFields.forEach(el => delete queryObj[el]);
    
    // Parse operator fields (>, <, >=, <=, =)
    const operatorMap = {
        '>=': '$gte',
        '<=': '$lte',
        '>': '$gt',
        '<': '$lt',
        '=': '$eq'
    };
    
    const filter = {};
    
    // Process each query parameter
    for (const [key, value] of Object.entries(queryObj)) {
        // Skip empty values
        if (value === '' || value === null || value === undefined) continue;
        
        // Handle operator fields (field[operator]=value)
        const match = key.match(/(\w+)(>=|<=|>|<|=)$/);
        
        if (match) {
            const [, field, operator] = match;
            const mongoOperator = operatorMap[operator];
            
            // Convert numeric values
            const parsedValue = isNaN(Number(value)) ? value : Number(value);
            
            // Initialize field object if not exists
            filter[field] = filter[field] || {};
            filter[field][mongoOperator] = parsedValue;
        } 
        // Handle regular fields (field=value)
        else {
            // Convert numeric values
            filter[key] = isNaN(Number(value)) ? value : Number(value);
        }
    }
    
    // Handle search parameter
    if (query.search) {
        const searchRegex = new RegExp(query.search, 'i');
        
        // Create OR conditions for allowed fields
        const orConditions = allowedFields.map(field => ({
            [field]: searchRegex
        }));
        
        // Combine with existing filters
        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }
    }
    
    return filter;
};

module.exports = filterQuery;