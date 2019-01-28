import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


@Injectable()
export class MainService {
    
    public jwtToken: string;

    constructor(private http: Http) {
        const theUser:any = JSON.parse(localStorage.getItem('currentUser'));
        if (theUser) {
            this.jwtToken = theUser.token;
        }
    }
    
    saveMain(userid, oMain){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:9090/api/main/${userid}`, JSON.stringify(oMain), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getMains(userid, oMain) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:9090/api/main/report/${userid}`, JSON.stringify(oMain), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getMainTotal(userid, oMain) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:9090/api/main/total/${userid}`, JSON.stringify(oMain), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getMain(mainid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:9090/api/main/${mainid}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    delMain(mainid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(`http://localhost:9090/api/main/${mainid}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

     private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
