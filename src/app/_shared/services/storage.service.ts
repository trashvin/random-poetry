import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {

  constructor() {
    this.filter_tags = "";
   }
  getValue(key: string) {
    return localStorage.getItem(key);
  }
  setValue(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  public set is_anonymous(value: boolean) {
    // setting this value starts a new session, clear local storage
    if ( value === true) {
      this.is_logged_in = false;
    } 
    this.setValue("is_anonymous", value.toString() );
  }
  public get is_anonymous(): boolean {
    const value = this.getValue("is_anonymous");
    if ( value != null && value.toLowerCase() === "true") {
        return true;
    } else {
        return false;
    }
  }
  public get is_logged_in(): boolean {
    const value = this.getValue("is_logged_in");
    if ( value !== null ) {
      if ( value.toLowerCase() === "true") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  public set is_logging_in(value: boolean) {
    // setting this value starts a new session, clear local storage
    if (value) {
      this.is_anonymous = false;
    }
    this.setValue("is_logging_in", value.toString() );
  }
  public get is_logging_in(): boolean {
    const value = this.getValue("is_logging_in");
    if ( value !== null ) {
      if ( value.toLowerCase() === "true") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  public set is_logged_in(value: boolean) {
    // setting this value starts a new session, clear local storage
    if (value) {
      this.is_anonymous = false;
    }
    this.setValue("is_logged_in", value.toString() );
  }
  public get is_busy(): boolean {
    const value = this.getValue("is_busy");
    if ( value != null && value.toLowerCase() === "true") {
        return true;
    } else {
        return false;
    }
  }
  public set is_busy(value: boolean) {
    // setting this value starts a new session, clear local storage
    this.setValue("is_busy", value.toString() );
  }
  public get current_action(): number {
    return parseInt(this.getValue("current_action"), 10);
  }
  public set current_action(value: number) {
    // setting this value starts a new session, clear local storage
    this.setValue("current_action", value.toString() );
  }
  public set user_name(value: string) {
    this.setValue("user_name", value);
  }
  public get user_name(): string {
    return this.getValue("user_name");
  }
  public set user_email(value: string) {
    this.setValue("user_email", value);
  }
  public get user_email(): string {
    return this.getValue("user_email");
  }
  public set user_picture(value: string) {
    this.setValue("user_picture", value);
  }
  public get user_picture(): string {
    return this.getValue("user_picture");
  }
  public set filter_tags(value: string) {
    this.setValue("filter_tags", value);
  }
  public get filter_tags(): string {
    return this.getValue("filter_tags");
  }
  public get is_filtered(): boolean {
    if ( this.getValue("filter_tags") !== null) {
      if ( this.getValue("filter_tags").trim() !== "" ) {
        return true;
      } else {
        return false;
      }
    }else {
      return false;
    }
  }

  public clear() {
    this.filter_tags = "";
    this.user_name = "";
    this.user_email = "";
    this.user_picture = "";
    this.current_action = 0;
    this.is_busy = false;
    // this.is_anonymous = false;
    this.is_logged_in = false;
    this.is_logging_in = false;
  }

}
