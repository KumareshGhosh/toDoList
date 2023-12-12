/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement,track } from 'lwc';
import addTodo from '@salesforce/apex/ToDoController.addTodo';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';

export default class ToDoManager extends LightningElement {
    time='8:15 PM';
    greeting='Good Evening';
    @track todos=[];
    connectedCallback(){
        //to view all the already existed records whenever we reload the page:
        this.fetchToDos();
        //make the time dynamic so user don't have to reload to see new time everytime:
        setInterval(() => {
            this.getTime();
           // console.log('set interval called');
        }, 1000*1);       
    }
    getTime(){
       const currentDate= new Date();
       const hour=currentDate.getHours();
       const minutes=currentDate.getMinutes();
       this.time=`${this.setHour(hour)}:${this.getDouble(minutes)} ${this.setAMPM(hour)}`
       this.setGreeting(hour);
    }
    //set 12 hour format:
    setHour(hour){
        return hour===0? 12 : hour>12? (hour-12):hour;
    }
    //set the am/pm
    setAMPM(hour){
        return hour>=12? "PM":"AM";
    }
    //get double digit for mint:
    getDouble(digit){
        return  digit>=10?digit:'0'+digit; 
    }
    //set greeting:
    setGreeting(hour){
        if(hour<12){
            this.greeting='Good Morning Tatai!';
        }else if(hour>=12 && hour<17){
            this.greeting='Good Afternoon Tatai!'
        }else{
            this.greeting='Good Evening Tatai!';
        }
    }
    todoHandler(){
        const inputBox = this.template.querySelector("lightning-input");
        //console.log('input box value: ',inputBox.value);
        const todo={
            todoName:inputBox.value,
            done:false  
        }
        addTodo({payload: JSON.stringify(todo)}).then(res=>{
            console.log('Element succsefully inserted');
            this.fetchToDos();
        }).catch(error=>{
            console.error('Error in inserting new todo\'s'+error);
        })
        //this.todos.push(todo);
        inputBox.value="";
    }
    fetchToDos(){
        getCurrentTodos().then(res=>{
            console.log('retrieved todos from the server',res.length);
            //instead of pushing in above method, we are assigning todos to the response. 
            this.todos = res;
        }).catch(error=>{
            console.error('error in fetching the details: '+error.body.message);
        })
    }
    get upcomingTasks(){
        return this.todos && this.todos.length? this.todos.filter(todo=>
            !todo.done): []; 
    }
    get completedTasks(){
        return this.todos && this.todos.length? this.todos.filter(todo=>
            todo.done): [];
    }
    updateHandler(){
        this.fetchToDos();//making sure to update the list in the app after the update
    }
    deleteHanadler(){
        this.fetchToDos();
    }
}