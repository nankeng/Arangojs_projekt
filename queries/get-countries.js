const { aql } = require('arangojs')
module.exports = (transportColl, countriesColl, filters = {}) => aql`
FOR transport in ${transportColl}
    COLLECT s = transport._to
    AGGREGATE supplier = SORTED_UNIQUE((transport.Supplier))
    LET country = (
        FOR c IN ${countriesColl}
            FILTER c._id == s
            LIMIT 1
            RETURN {
                "Country": c._key,
                "Region": c.Region
            }
    )
    // Dynamic AQL fragments
    ${aql.literal(filters.country ? `FILTER country[0].Country == "${filters.country}"` : '')}
    ${aql.literal(filters.region ? `FILTER country[0].Region == "${filters.region}"` : '')}

    RETURN {
        "Country": country[0].Country,
        "Region": country[0].Region,
        "Supplier": supplier
        
    }
    `
