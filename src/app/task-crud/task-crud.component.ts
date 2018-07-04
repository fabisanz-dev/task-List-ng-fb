import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../servicios/auth.service';


@Component({
  selector: 'app-task-crud',
  templateUrl: './task-crud.component.html',
  styleUrls: ['./task-crud.component.css']
})
export class TaskCrudComponent implements OnInit {

  public taskList;
  public taskListOffline;
  public ShownewTask: boolean;
  public EditTask: boolean;
  public task;
  //afDB: any;

  public isLogin: boolean;
  public nombreUsuario = '';
  public emailUsuario = '';
  public fotoUsuario = '';

  constructor(
    private _afDB: AngularFireDatabase,
    public authService: AuthService
    ) {
    
    this.ShownewTask = false;
    this.EditTask = false;
    this.taskList = [];
    this.task = {id: null, title: '', descripcion: ''};

    this.taskListOffline = [];
    this.isLogin = false;
   }

  ngOnInit() {
    if(navigator.onLine){
      this._afDB.list('taskList').valueChanges().subscribe(
        (task)=>{
          //guard fb y storage
          this.taskList = task; 
          sessionStorage.setItem('taskList', JSON.stringify(this.taskList));
        }
      );  
    }else{
      console.log(navigator.onLine)
      this.taskList = JSON.parse(sessionStorage.getItem('taskList'));
    }

    //login
    this.authService.getAuth().subscribe( auth => {
      if (auth) {
        this.isLogin = true;
        this.nombreUsuario = auth.displayName;
        this.emailUsuario = auth.email;
        this.fotoUsuario = auth.photoURL;
      } else {
       this.isLogin = false;
      }
    });
  }

  newTask(){
    this.ShownewTask = true;
    this.task = {id: null, title: '', descripcion: ''};
  }

  CancelTask(){
    this.ShownewTask = false;
  }

  saveTask(){
    
    if(navigator.onLine){
      if(this.EditTask){
        this._afDB.database.ref('taskList/' + this.task.id).set(this.task);
      }else{
        this.task.id = Date.now();
        this._afDB.database.ref('taskList/' + this.task.id).set(this.task);
      }
    }else{
      //offline con taskList
      if(this.EditTask){
        this.taskList.map((e)=>{
          if(e.id == this.task.id){
            e = this.task;
          }
          return e;
        });

        this.taskListOffline.push({
          id: this.task.id,
          task: this.taskList,
          action: 'update'
        });

      }else{
        this.task.id = Date.now();
        this.taskList.push(this.task);

        this.taskListOffline.push({
          id: this.task.id,
          task: this.taskList,
          action: 'save'
        });
      }
    }
    
    this.taskList = sessionStorage.setItem('taskList', JSON.stringify(this.taskList));
    this.task = {id: null, title: '', descripcion: ''};
    this.EditTask = false;
  }

  editTask(taskEdit){
    this.task = taskEdit;
    this.ShownewTask = true;
    this.EditTask = true;
  }

  deleteTask(id){
    /*let position = id -1;
    this.taskList.splice(position, 1);*/
    if(navigator.onLine){
      this._afDB.database.ref('taskList/'+id).remove();
    }else{
      let position = id - 1;
      this.taskList.splice(position, 1);

      this.taskListOffline.push({
        id: id,
        action: 'remove'
      });

      
    }
    this.task = {id: null, title: '', descripcion: ''};
    sessionStorage.setItem('taskList', JSON.stringify(this.taskList));  
  }

  sincronyze(){
    this.taskListOffline.forEach(e => {
      switch (e.action) {
        case 'save':
          this._afDB.database.ref('taskList/' + e.id).set(e.task);
          break;
        case 'update':
          this._afDB.database.ref('taskList/' + e.id).set(e.task);
          break;
        case 'remove':
          this._afDB.database.ref('taskList/'+e.id).remove()
          break;
      
        default:
          console.log('no soportado');
          break;
      }

      this.taskListOffline.shift();
      console.log(this.taskListOffline);
    });
   
  }

  onClickGoogleLogin() {
    this.authService.loginGoogle()
     .then((res) => {
         console.log('logueado');
     }).catch( err => console.log(err.message));
   }

   logOut(){
     this.authService.logout();
   }

}
