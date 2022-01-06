const { aql } = require('arangojs')
module.exports = (ordersColl, filters={})=>aql`
FOR o IN ${ordersColl}

// Dynamic filters
${aql.literal(filters.id ? `FILTER o.ItemID == "${filters.id}"` : '')}
${aql.literal(filters.type ? `FILTER o.\`Item Type\` == "${filters.type}"` : '')}
${aql.literal(filters.mindate ? `FILTER o.\`Order Date\` >= "${filters.mindate}"` : '')}
${aql.literal(filters.maxdate ? `FILTER o.\`Order Date\` <= "${filters.maxdate}"` : '')}
${aql.literal(filters.channel ? `FILTER o.\`Sales Channel\` == "${filters.channel}"` : '')}
${aql.literal(filters.minunitprice ? `FILTER o.\`Unit Price\` >= ${filters.minprice}` : '')}
${aql.literal(filters.maxunitprice ? `FILTER o.\`Unit Price\` <= ${filters.maxprice}` : '')}
${aql.literal(filters.minunitcost ? `FILTER o.\`Unit Cost\` >= ${filters.minunitcost}` : '')}
${aql.literal(filters.maxunitcost ? `FILTER o.\`Unit Cost\` <= ${filters.maxunitcost}` : '')}

COLLECT id = o.ItemID
AGGREGATE   price = MIN(o.\`Unit Price\`),
          costs = MIN(o.\`Unit Cost\`),
          type = MIN(o.\`Item Type\`),
          unitsSold = SUM(o.\`Unit Sold\`),
          totalProfit = SUM(o.\`Total Profit\`),
          totalCost = SUM(o.\`Total Cost\`),
          totalRevenue = SUM(o.\`Total Revenue\`),
          latestPurchaseDate = MAX(o.\`Order Date\`)
${aql.literal(filters.minunitsold ? `FILTER unitsSold >= ${filters.unitsSold}` : '')}
${aql.literal(filters.maxunitsold ? `FILTER unitsSold <= ${filters.unitsSold}` : '')}
${aql.literal(filters.mintotalprofit ? `FILTER totalProfit >= ${filters.mintotalprofit}` : '')}
${aql.literal(filters.maxtotalprofit ? `FILTER totalProfit <= ${filters.maxtotalprofit}` : '')}
${aql.literal(filters.mintotalcost ? `FILTER totalCost >= ${filters.mintotalcost}` : '')}
${aql.literal(filters.maxtotalcost ? `FILTER totalCost <= ${filters.maxtotalcost}` : '')}
${aql.literal(filters.mintotalrevenue ? `FILTER totalRevenue >= ${filters.mintotalrevenue}` : '')}
${aql.literal(filters.maxtotalrevenue ? `FILTER totalRevenue <= ${filters.maxtotalrevenue}` : '')}

RETURN {
    [id] : {
    "type" : type,
    "price" : price,
    "costs" : costs,
    "stats": {
        "unitsSold" : unitsSold,
        "totalProfit": ROUND(totalProfit),
        "totalCost": ROUND(totalCost),
        "totalRevenue": ROUND(totalRevenue),
        "latestPurchaseDate": latestPurchaseDate
        }
    }
}
`