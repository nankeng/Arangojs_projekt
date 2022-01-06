const { aql } = require('arangojs')
module.exports = (ordersColl, filters = {}) => aql`
FOR order in ${ordersColl}
    // Dynamic AQL fragments
    ${aql.literal(filters.type ? `FILTER order.\`Item Type\` == "${filters.type}"` : '')}
    COLLECT type = order.\`Item Type\`
    AGGREGATE items = SORTED_UNIQUE((order.ItemID))

    RETURN {
        "Item Type":type,
        "Items":items
    }
 `