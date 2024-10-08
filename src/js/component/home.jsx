import React, { useEffect } from "react";
import { useState } from "react";
//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
		const apiUrl= 'https://playground.4geeks.com/todo/users/yasin_hdez';
		const apiUrlToDo= 'https://playground.4geeks.com/todo/todos';
		const [task, setTask] = useState([]);
		const [inputValue, setInputValue] = useState("");
		const [edit,setEdit]=useState(null);
		const [delet,setDelete]=useState(null);
		// Event handler for updating the array
		const handleArrayADD = (evt) => {
			if(evt.key==="Enter"){
				if (inputValue.trim() !== '') {
					// Add a new element at the end of the array
					if(edit==null){
						const newTask= { label: inputValue};
						AddTask(newTask);
					}
					else{
						const index =  parseInt(edit);
						const editTask= { label: inputValue, is_done: task[index].is_done, id: task[index].id };
						const newTask = [
							...task.slice(0, parseInt(index)),
							editTask,								
							...task.slice( parseInt(index) + 1) 
						  ];
						setTask(newTask);  
						setInputValue("");
						setEdit(null);  
						UpdateTask(editTask);  
					}
				}
				else{
					setEdit(null);
				}
			}
			
		};
		async function AddTask(newTask){
			const response = await fetch(apiUrlToDo+'/yasin_hdez', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newTask),
			  })
			  .then(resp => {
				  return resp.json();
			  })
			  .then(data => {
				  setInputValue("");
				  setTask(task => [...task, data]);
				 // console.log( `the data is: `,data);
			  })
			  .catch(error => {
				  console.log(error);
			  });
		}
		async function UpdateTask(Task){
			const response = await fetch(apiUrlToDo+`/${Task.id}`,{
				method: "PUT",
				body: JSON.stringify(Task),
				headers: {
				  "Content-Type": "application/json"
				}
			  })
			  .then(resp => {
				console.log(resp.ok); // Will be true if the response is successful
				console.log(resp.status); // The status code=200 or code=400 etc.
				console.log(resp.text()); // Will try to return the exact result as a string
				return resp.json(); // (returns promise) Will try to parse the result as JSON and return a promise that you can .then for results
			  })
			  .then(data => {
				data = Task;
				//  console.log(data); // This will print on the console the exact object received from the server
			  })
			  .catch(error => {
				  //   // Error handling
				  console.log(error);
			  });
		}
		async function deleteTask(index){
			const taskToDelete = task[index];
			if(taskToDelete && taskToDelete.id){
				const response = await fetch(apiUrlToDo+`/${taskToDelete.id}`, {
					method: 'DELETE',
				});
				if (response.ok) {
					const text = await response.text();
					const data = text ? JSON.stringify(text): {};
					return data; 
				} else {
					console.log('error: ', response.status, response.statusText);
					return {error: {status: response.status, statusText: response.statusText}};
				}
			}
		};
		useEffect(()=>{
				if(edit!=null){
					setInputValue(task[edit].label);
				}
				if(delet!=null){
					const index =parseInt(delet);
					const newTask = [
						...task.slice(0, parseInt(index)), 
						...task.slice( parseInt(index) + 1) 
					];
					deleteTask(delet);
					setTask(newTask); 
					setInputValue("");
					setEdit(null); 
					setDelete(null); 
				}
		},[edit,delet]
		);
		useEffect(()=>{
			function getToDos(){
				fetch(apiUrl).then(response=>{
					if(response.ok){
						return response.json();
					} else { return addUser()}
				})
				.then((data=>{
					setTask(data.todos); 
					console.log(data)
				}))
				.catch(error=>console.error('Erorr: ', error));
			}
			getToDos()
		},[])
		function addUser(){
			fetch(apiUrl,{
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({name: `yhreyes100`})
			}).then(response=>response.json())
			.then(()=>getApi())
			.catch(error=>console.log(`Error: ` , error));
		}
		function deleteAll(){
			task.forEach((task)=>{
				fetch(apiUrlToDo+`/${task.id}`,{
					method:'DELETE',
				})
				.then(response => {
					if(response.ok){console.log(response)}
					else {console.log(response.status)}
				})
				.catch(error => console.error(`El error: `, error))
			})
			setTask([]);
		}
		return (
			
			<div className="container d-grid justify-content-center">
						<div className="list">
								<ul className="list-group ">
									<li className="list-group-item list-group-item-secondary">
									<input
									type="text"
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									placeholder="Enter a task"
									onKeyDown={handleArrayADD}
								/>
									</li>
									<li className="list-group-item list-group-item-secondary first" >
															<div className="">
																You Need To Add New Task on The Task List
															</div>
									</li> 
									{
									task!=null?	
									task.map((t,index)=>(
													<li key={index} className="list-group-item list-group-item-secondary flex-container" >
															<div className="text">
																	{t.label} 	
															</div>
															<div className="img flex-container">
																	<i onClick={()=>setDelete(index)} className="far fa-trash-alt"  ></i>
																	<i onClick={()=>setEdit(index)} className="far fa-edit" ></i>
															</div>
													</li> 

									)):""}
									<li  className="list-group-item list-group-item-secondary flex-container">
									<div className="first">{`${task!=null?task.length:"0"} Items` }</div> 
									{task.length<2?"":<div ><b className="btn btn-outline-secondary" onClick={()=>(deleteAll())}><i className="far fa-trash-alt" ></i> DELETE ALL</b></div>}
									</li>
								</ul>
						</div>
						{	task!=null?
							task.length>0?
							<>
							<div className="pag1 list-group-item-secondary"></div>
							<div className="pag2 list-group-item-secondary"></div>
							</>:"":""
						}
						<div></div>
						
			</div>
		);
};

export default Home;