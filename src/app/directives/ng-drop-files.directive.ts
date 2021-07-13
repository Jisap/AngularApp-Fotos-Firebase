import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];                                    // Recibiremos un array de archivos 
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();      // Emite un evento booleano llamado mouseSobre

  constructor() { }

  @HostListener('dragover', ['$event']) public onDragEnter(event: any){  // A la escucha del evento dragover que disparará el 
    this.mouseSobre.emit(true);                                          // evento booleano mouseSobre=true el cual activará
    this._prevenirDetener(event)                                         // la clase que pone en azul la zona de drop 
  }                                                                      

  @HostListener('dragleave', ['$event']) public onDragleave(event: any) {// A la escucha del evento dragover que disparará el 
    this.mouseSobre.emit(false);                                         // evento booleano mouseSobre=false lo cual desactivará
  }                                                                      // la clase que pone en azul la zona de drop 

  @HostListener('drop', ['$event']) public onDrop(event: any) {
                                                                
    const transferencia = this._getTransferencia(event);       // Obtendremos los datos o archivos a subir a firebase

      if (!transferencia){                                     // Si no existen archivos return 
        return;
      }
      this._extraerArchivos( transferencia.files);             // Pero si si existen archivos los obtenemos
      this._prevenirDetener(event);                            // Prevenimos la propagación del evento.  
      this.mouseSobre.emit(false);                             // Cuando se ejecute el drop se disparara el evento booleano que
                                                               // hara que mouseSobre=false lo cual desactivará la clase que pone en azul la 
                                                               // zona drop
  } 
  
  private _getTransferencia( event:any){                                               // Recibe el evento y obtiene la data
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // Si hay dataTransfer usa dataTransfer, pero sino
  }                                                                                    // busca la dataTransfer en originalEvent
  
  private _extraerArchivos( archivosLista: FileList){
    console.log(archivosLista)
  
    for( let i=0; i<archivosLista.length; i++){              // Bucle for con la longitud de los archivos a subir
      const archivoTemporal = archivosLista[i];              // archivoTemporal = al valor del objeto en la posicion i, osea el file
      if(this._archivoPuedeSerCargado(archivoTemporal)){     // Cada file se pasa por la validacion  y si pasa
        const nuevoArchivo = new FileItem(archivoTemporal);  // creamos un nuevo fileItem
        this.archivos.push(nuevoArchivo)                     // que se agrega al array de arhivos a subir a firebase 
        console.log(this.archivos)
      }
    }
  }

  //Validaciones
  private _archivoPuedeSerCargado( archivo:File):boolean{
    if(!this._archivoYaFueDroppeado(archivo.name) && this._esImagen(archivo.type)){  // Si el archivo no fue dropeado y es tipo imagen
      return true;                                                                   // retorna un true, caso contrario un false.
    }else{
      return false;
    }
  }


  private _prevenirDetener( event:any ){  // Evitamos que la imagen se habra cuando soltamos el archivo
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueDroppeado( nombreArchivo: string): boolean{  // Evitamos que se dropeen archivos duplicados.
    for(const archivo of this.archivos){
      if( archivo.nombreArchivo == nombreArchivo){
        console.log('El archivo ' + nombreArchivo + 'ya esta agregado')
        return true;
      }
    }
    return false;
  }

  private _esImagen (tipoArchivo:string):boolean{                                                        // Si el archivo viene vacio o undefined
    return( tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image'); // el método devuelve false 
  }                                                                                                      // Si el archivo tiene contenido y en el 
}                                                                                                        // doctype pone image devuelve un true
