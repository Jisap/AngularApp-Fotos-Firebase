//npm install firebase @angular/fire
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileItem } from '../models/file-item';
//import * as firebase from 'firebase'
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';                               // Carpeta donde vamos a grabar en firestore

  constructor(private db: AngularFirestore,                       // Inyección de los servicios de firebase                      
              private storage: AngularFireStorage) {}             // y fireStorage

  cargarImagenesFirebase(imagenes: FileItem[]):void {             // Método que recibe el array de imagenes y lo sube a firebase
     
    for(const item of imagenes){                                                // Recorremos el array y obtenemos cada item/file
      item.estaSubiendo=true;                                                   // Establecemos la prop estaSubiendo = true 
      if( item.progreso >=100 ){                                                // Si la prop progreso llego al 100% y continua
        continue
      }
      const file = item.archivo;                                                // Definimos el file
      const filePath = `${ this.CARPETA_IMAGENES }/${ item.nombreArchivo}`;     // Definimos la ruta de acceso local al file
      const fileRef = this.storage.ref(filePath);                               // Definimos la referencia al file en firestorage 
      const uploadTask = this.storage.upload(filePath, file);                   // Definimos la tarea ppal de subida a firestorage
    
      // con esta función nos suscribimos a los cambios en el progreso          // Ejecutamos la tarea principal y nos devolvera varios callbacks 
      uploadTask.percentageChanges().subscribe((resp) => item.progreso = Number(resp));// percentageChanges nos informa de los cambios en el % de subida
      
      // obtengo el url de descarga cuando este disponible                       
      uploadTask.snapshotChanges().pipe(                                         // Con snapshotChanges observamos los cambios producidos al terminar 
        finalize(                                                                // de subir, esto cambios los pasamos por un pipe
          () => fileRef.getDownloadURL().subscribe(url => {                      // que obtendrá la url desde la ref del firestorage
            console.log('Imagen cargada con exito');                             
            item.url = url;                                                       
            item.estaSubiendo = false;                                            
            this.guardarImagen({                                                 // Grabamos al final en firebase Database el nombre y la url
              nombre: item.nombreArchivo,
              url: item.url
            });
          })
        )
      ).subscribe();
    } 
  }

  private guardarImagen(imagen: {nombre:string, url:string}) {    // Método de grabación en firestore database

    this.db.collection(`/${ this.CARPETA_IMAGENES }`)
      .add( imagen)
  }
}
