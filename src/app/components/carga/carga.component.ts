import { Component, OnInit } from '@angular/core';
import { FileItem } from 'src/app/models/file-item';
import { CargaImagenesService } from '../../services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: [
  ]
})
export class CargaComponent implements OnInit {

  estaSobreElemento: boolean = false;

  archivos:FileItem[] = [];  // Inicializamos el array donde guardaremos los archivos a subir a firestore

  constructor(public _cargaImagenes:CargaImagenesService) { }  // Inyectamos el servicio _cargaImagenes

  ngOnInit(): void {
  }

  cargarImagenes(){                                            // Este método usa el servicio cargarImagenesFirebase
    this._cargaImagenes.cargarImagenesFirebase(this.archivos)  // para mostrar los archivos del array
  }

  limpiarArchivos(){
    this.archivos = []
  }
}
