import { Injectable } from "@angular/core";

@Injectable()
export class SessionService {
  constructor() {
   }
  getValue(key: string) {
    return sessionStorage.getItem(key);
  }
  setValue(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }
  public clear() {
    sessionStorage.clear();
  }


}
