import { getPassengers } from '../apis';


export const TodosActions = {

	async queryPassenger(){
		try{
			let Passengers = await getPassengers();
			console.log(Passengers);
		}catch(e){
			console.log('--------error---------', e);
			alert(e);

		}

	}
}
