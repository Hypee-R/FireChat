import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { Mensaje } from '../interfaces/mensaje.interface';
@Injectable()
export class ChatService {
  itemsCollection: AngularFirestoreCollection<Mensaje> = new AngularFirestoreCollection(null, null,this.afs);
  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {

    afAuth.authState.subscribe(user => {
      console.log('Estado del usuario ', user);

      if(!user) return;

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;

    });

  }

  login(proveedor: string){
    let provider;
    if(proveedor === 'google'){
      provider = new firebase.default.auth.GoogleAuthProvider();
    }else if(proveedor === 'facebook'){
      provider = new firebase.default.auth.FacebookAuthProvider();
    }
    this.afAuth.auth.signInWithPopup(provider)
    .then( (data: any) => {
      alert('Logeado con Facebook correctamente')
      console.log(data)
    })
    .catch( (error:any) => {
      alert('Ocurrió un error')
      console.log(error)
    })
  }

  logout(){
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));
    return this.itemsCollection.valueChanges()
            .pipe(
              map((mensajes: Mensaje[]) => {
                this.chats = [];
                for(let msj of mensajes){
                  this.chats.unshift(msj);
                }
              })
            )
  }

  agregarMensaje(texto: string){
      // TODO falta el UID del usuario
      let mensaje: Mensaje = {
        uid: this.usuario.uid,
        nombre: this.usuario.nombre,
        mensaje: texto,
        fecha: new Date().getTime()
      };

      return (this.itemsCollection.add(mensaje));
  }
}
