import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FileItem } from '../../models/file-item';

export interface Item { nombre:string, url: string }

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styles: [
  ]
})
export class FotosComponent implements OnInit {

  item$:Observable<any[]>;                                                  // Creamos un observable

  constructor(firestore: AngularFirestore) {                                // Inyectamos el firestore (base de datos)
    this.item$ = firestore.collection('img').valueChanges();                // Generamos los datos de cada item almacenado en bd
  }

  
  ngOnInit(): void {
  }

}
