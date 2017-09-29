import Lokka from 'lokka';
import Transport from 'lokka-transport-http';

const client = new Lokka({
  transport: new Transport(`/graphql`)
})

const passengerInfo = client.createFragment(`
  fragment on Passenger {
    domainDeptID
    type
    nodeDesc
    deptNodeName
    foreNodeCode
  }
`)

export const getPassengers = () => {
  return client.query(`
  {
    passenger (type:2) {
      domainDeptID
      type
      nodeDesc
      deptNodeName
      foreNodeCode
    }
  }
  `)
}
