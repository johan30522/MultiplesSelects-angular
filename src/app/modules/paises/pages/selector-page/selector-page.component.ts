import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { tap, switchMap, delay } from 'rxjs/operators';
import { PaisSmall } from '../../interfaces/paisSmall';
import { Pais } from '../../interfaces/pais';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  //Listas de selects
  public regiones: string[] = [];
  public paises: PaisSmall[] = [];
  public fronteras: PaisSmall[]=[];
  //UI
  public cargando:boolean=false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly paisesService: PaisesService,
  ) { }

  public miForm: FormGroup = this.formBuilder.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]],
  })

  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    //carga las regiones
    this.regiones = this.paisesService.regions;
    //*********carga los paises********************
    this.miForm.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          //se resetea el campo
          this.cargando=true;
          this, this.miForm.get('pais')?.reset('');
          this, this.miForm.get('frontera')?.reset('');
         // this, this.miForm.get('frontera')?.disable();
        }),
        //obtiene la region seleccionada y carga los paises
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        //obtiene los paises
        this.paises = paises;
        this.cargando=false;
      })


    //*********carga el pais********************
    this.miForm.get('pais')?.valueChanges
      .pipe(
        //delay(3000),
        tap((_) => {
          //se resetea el campo
          this, this.miForm.get('frontera')?.reset('');
          this.fronteras=[];
          this.cargando=true;
         // this, this.miForm.get('frontera')?.enable();
        }),
        //obtiene el pais seleccionada y carga los paises
        switchMap(codigo => this.paisesService.getPaisesPorCodigo(codigo)),
        //obtiene la lista de paises, de la forntera del pais consultado en el switchmap anterior
        switchMap((pais)=>this.paisesService.getPaisesPorMultiplesCodigos(pais?.borders!))
      )
      .subscribe(paises => {
        //obtiene los paises
        console.log(paises);
        this.fronteras=paises;
       //this.fronteras = pais?.borders || [];
        this.cargando=false;
      })

    /*
        this.miForm.get('pais')?.valueChanges
          .subscribe((pais) => {
            console.log(pais);
          })*/
  }

  public seleccionar() {
    console.log('seleccionado');
    console.log(this.miForm.value);

  }

}
