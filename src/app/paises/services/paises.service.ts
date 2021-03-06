import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisFrontera, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private _baseURL : string = 'https://restcountries.com/v2';

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {
    const url: string = `${ this._baseURL }/region/${ region }?fields=alpha3Code,name`;

    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo( codigo: string ): Observable<PaisFrontera | null>  {
    if( !codigo ) {
      return of(null)
    }

    const url: string = `${ this._baseURL }/alpha/${ codigo }`;

    return this.http.get<PaisFrontera>(url);
  }

  getPaisPorCodigoSmall( codigo: string ): Observable<PaisSmall>  {
    const url: string = `${ this._baseURL }/alpha/${ codigo }?fields=alpha3Code,name`;

    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigo( borders: string[]): Observable<PaisSmall[]> {
    if( !borders ) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);

      peticiones.push(peticion);
    } )

    return combineLatest( peticiones );
  }
}
