import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  mensaje: string = "";
  elemento: any;
  constructor(public _cs: ChatService) {

    this._cs.cargarMensajes()
          .subscribe( ()=> {

            setTimeout(() => {
              this.elemento.scrollTop = this.elemento.scrollHeight;
            }, 20);

          });

  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }

  enviarMensaje(){

    if(this.mensaje.length > 0){
      this._cs.agregarMensaje(this.mensaje)
              .then( () => this.mensaje = '' )
              .catch( (err)=> console.log("Error al enviar ", err));
    }

  }
}
