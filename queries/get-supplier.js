const { aql } = require('arangojs')
module.exports = (transportColl, countriesColl, filters = {}) => aql`
FOR transport in ${transportColl}
    FILTER NOT_NULL(transport.Supplier)
    ${aql.literal(filters.name ? `FILTER transport.Supplier == "${filters.name}"` : '')}
    LET country = transport._from
    COLLECT s = transport.Supplier INTO supplier KEEP country
    LET country = (
        FOR c IN ${countriesColl}
            FILTER c._id == supplier[0].country
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
        "Supplier": s,
        "Location": country[0]
    }
    `
