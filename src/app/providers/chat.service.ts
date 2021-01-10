import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Mensaje } from '../interfaces/mensaje';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario:any={};

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) { 
    this.auth.authState.subscribe(
      user=>{
        console.log(user)
        if(!user) {
          return
        }

        this.usuario.nombre=user.displayName;
        this.usuario.uid=user.uid;

      }
    )
  }

  cargarMensajes() {
    this.chatCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));
    return this.chatCollection.valueChanges()
      .pipe(map((mensajes: Mensaje[]) => {
        
        this.chats=[];
        for (let mensaje of mensajes) {
          this.chats.unshift(mensaje)
        }

        return this.chats
      }))
  }

  agregarMensaje(texto: string) {
    
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid:this.usuario.uid
    };

    return this.chatCollection.add(mensaje)
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.usuario={};
    this.auth.signOut();
  }
}