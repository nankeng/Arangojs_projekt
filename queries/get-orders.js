const { aql } = require('arangojs')
module.exports = (ordersColl, transportsColl, countriesColl, filters = {}) => aql`
FOR o IN ${ordersColl}
    // Dynamic AQL fragments
    ${aql.literal(filters.id ? `FILTER o._key == "${filters.id}"` : '')}
    ${aql.literal(filters.type ? `FILTER o.\`Item Type\` == "${filters.type}"` : '')}
    ${aql.literal(filters.minorderdate ? `FILTER o.\`Order Date\` >= "${filters.minorderdate}"` : '')}
    ${aql.literal(filters.maxorderdate ? `FILTER o.\`Order Date\` <= "${filters.maxorderdate}"` : '')}
    ${aql.literal(filters.channel ? `FILTER o.\`Sales Channel\` == "${filters.channel}"` : '')}
    ${aql.literal(filters.priority ? `FILTER o.\`Order Priority\` == "${filters.priority}"` : '')}
    ${aql.literal(filters.minunitsold ? `FILTER o.\`Unit Sold\` >= ${filters.minunitsold}` : '')}
    ${aql.literal(filters.maxunitsold ? `FILTER o.\`Unit Sold\` <= ${filters.maxunitsold}` : '')}
    ${aql.literal(filters.minrevenue ? `FILTER o.\`Total Revenue\` >= ${filters.minrevenue}` : '')}
    ${aql.literal(filters.maxrevenue ? `FILTER o.\`Total Revenue\` <= ${filters.maxrevenue}` : '')}
    ${aql.literal(filters.mincost ? `FILTER o.\`Total Cost\` >= ${filters.mincost}` : '')}
    ${aql.literal(filters.maxcost ? `FILTER o.\`Total Cost\` <= ${filters.maxcost}` : '')}
    ${aql.literal(filters.minprofit ? `FILTER o.\`Total Profit\` >= ${filters.minprofit}` : '')}
    ${aql.literal(filters.maxprofit ? `FILTER o.\`Total Profit\` <= ${filters.maxprofit}` : '')}

    LET id = o._key
    LET transportData = (
        FOR transport IN ${transportsColl}
            FILTER transport._key == o._key
            LET fromCountry = (
                FOR c IN ${countriesColl}
                    FILTER c._id == transport._from
                    LIMIT 1
                    RETURN {
                        "Country": c._key,
                        "Region": c.Region
                    }
            )
            LET toCountry = (
                FOR c IN ${countriesColl}
                    FILTER c._id == transport._to
                    LIMIT 1
                    RETURN {
                        "Country": c._key,
                        "Region": c.Region
                    }
            )
            RETURN {
                "fromCountry": fromCountry[0], 
                "toCountry": toCountry[0], 
                "Supplier": transport.Supplier,
                "Ship Date": transport.\`Ship Date\`
            }
        )
        // Dynamic AQL fragments
        ${aql.literal(filters.fromcountry ? `FILTER transportData[0].fromCountry.Country == "${filters.fromcountry}"` : '')}
        ${aql.literal(filters.fromregion ? `FILTER transportData[0].fromCountry.Region == "${filters.fromregion}"` : '')}
        ${aql.literal(filters.tocountry ? `FILTER transportData[0].toCountry.Country == "${filters.tocountry}"` : '')}
        ${aql.literal(filters.toregion ? `FILTER transportData[0].toCountry.Region == "${filters.toregion}"` : '')}
        ${aql.literal(filters.supplier ? `FILTER transportData[0].Supplier == "${filters.supplier}"` : '')}
        ${aql.literal(filters.minshipdate ? `FILTER transportData[0].\`Ship Date\` >= "${filters.minshipdate}"` : '')}
        ${aql.literal(filters.maxshipdate ? `FILTER transportData[0].\`Ship Date\` <= "${filters.maxshipdate}"` : '')}
        RETURN {"Order":o, "Transport":transportData[0]}`
