const { aql } = require('arangojs')
module.exports = (transportColl, countriesColl, orderColl, filters = {}) => aql`
FOR transport in ${transportColl}
FILTER transport.Supplier == "Beauty-DE"
LET transportData = (
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
LET orderData = (
FOR o IN ${orderColl}
    FILTER o._key == transport._key
    RETURN o
)

RETURN {
transport, transportData, orderData
}
 `