import data from './data'

export const findByType = (type) => {
	return data.deptUserTreeBos.filter(item => item.type === type);
}

export const  findChildrenBydomainDeptID = (domainDeptID) => {

	return data.deptUserTreeBos.filter(item => item.foreNodeCode === domainDeptID);
}

export const findRoot = () => {
	return data.deptUserTreeBos.filter(item => item.foreNodeCode === item.domainDeptID);
}

export const find = ({type, domainDeptID}) =>{
	let result = [];
	if(type && domainDeptID){
		result = data.deptUserTreeBos.filter(item => (item.foreNodeCode === domainDeptID) && item.type === type);
	}
	else if(type){

		result = findByType(type);
	}else if(domainDeptID){
		result = findChildrenBydomainDeptID(type)
	}

	return result;
}

export default {
	findByType,
	findChildrenBydomainDeptID,
	findRoot,
	find
}
