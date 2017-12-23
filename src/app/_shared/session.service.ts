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
  public set is_processing(value: boolean) {
    // setting this value starts a new session, clear local storage
    this.setValue("is_processing", value.toString() );
  }
  public get is_processing(): boolean {
    const value = this.getValue("is_processing");
    if ( value != null && value.toLowerCase() === "true") {
        return true;
    } else {
        return false;
    }
  }
  public get is_home(): boolean {
    const value = this.getValue("is_home");
    if ( value != null && value.toLowerCase() === "true") {
        return true;
    } else {
        return false;
    }
  }
  public set is_home(value: boolean) {
    // setting this value starts a new session, clear local storage
    this.setValue("is_home", value.toString() );
  }
  public get is_logged_in(): boolean {
    const value = this.getValue("is_logged_in");
    if ( value != null && value.toLowerCase() === "true") {
        return true;
    } else {
        return false;
    }
  }
  public set is_logged_in(value: boolean) {
    // setting this value starts a new session, clear local storage
    this.setValue("is_logged_in", value.toString() );
  }


}
