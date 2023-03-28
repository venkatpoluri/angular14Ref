export const GridViews = {
    users: [
        { column: "name", type: "string", attributeName: 'given_name' },
        { column: "email", type: "string" },
        { column: "roles", type: "string" },
        { column: "department", type: "string", attributeName:'custom:department' },
        { column: "created on", type: "string", attributeName:'userCreateDate' },
        { column: "active", type: "dropdown" }
    ],
    tradingPartners: [
        { column: "name", type: "string" },
        { column: "type", type: "dropdown" },
        { column: "city", type: "string" },
        { column: "state", type: "string" },
        { column: "status", type: "dropdown" }]
}