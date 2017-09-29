const typeDefs = `

type Passenger {
    domainDeptID: String
    type: Int
    nodeDesc: String
    deptNodeName: String
    foreNodeCode: String
}

type Query {
    passenger(domainDeptID: String, type: Int): [Passenger]
}

`;

export default typeDefs;
