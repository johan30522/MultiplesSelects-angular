import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall } from '../interfaces/paisSmall';
import { Pais } from '../interfaces/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private _urlApi: string = 'https://restcountries.com/v2';

  get regions() {
    return [...this._regions];
  }

  constructor(
    private readonly http: HttpClient) {
  }


  public getPaisesPorRegion(id: string): Observable<PaisSmall[]> {
    const url: string = `${this._urlApi}/continent/${id}?fields=name,alpha3Code`;
    return this.http
      .get<PaisSmall[]>(url);
  }




  public getPaisesPorCodigo(code: string): Observable<Pais | null> {

    if (!code) {
      return of(null);
    }
    const url: string = `${this._urlApi}/alpha/${code}`;
    return this.http
      .get<Pais>(url);
  }
  public getPaisesPorCodigoSmall(code: string): Observable<PaisSmall> {

    const url: string = `${this._urlApi}/alpha/${code}`;
    return this.http
      .get<PaisSmall>(url);
  }


  public getPaisesPorMultiplesCodigos(borders: string[]): Observable<PaisSmall[]> {

    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach(codigo => {
      const peticion = this.getPaisesPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });
    return combineLatest(peticiones);
  }
}
