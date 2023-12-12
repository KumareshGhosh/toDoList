import { LightningElement,api } from 'lwc';
import deleteTodo from '@salesforce/apex/ToDoController.deleteTodo';
import updateTodo from '@salesforce/apex/ToDoController.updateTodo';

export default class ToDoItem extends LightningElement {
    @api todoId;
    @api todoName;
    @api done=false;
    //for style usage in CSS file
    get containerClass(){
        return this.done ? 'todo completed':'todo upcoming';
    }
    get iconName(){
        return this.done ? 'utility:check':'utility:add';
    }
    updateHandler(){
        const todo= {
            todoId:this.todoId,
            todoName:this.todoName,
            done:!this.done
        };
        updateTodo({payload:JSON.stringify(todo)}).then(res=>{
            console.log('item succesfully updated',res);
            const updateEvent=new CustomEvent('update');
            this.dispatchEvent(updateEvent);//dispatching with no detail value just to make a call to parent componen to make the process automated.
        }).catch(error=>{
            console.error("Item failed to update",error);
        })
    }
    deleteHandler(){
        deleteTodo({todoId:this.todoId}).then(res=>{
            console.log('Item succesfully deleted',res);
            const deleteEvent=new CustomEvent('delete');
            this.dispatchEvent(deleteEvent);
        }).catch(error=>{
            console.error('item failed to be deleted',error);
        })
    }
}