import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {

  constructor() { }
  getValue(key: string) {
    return localStorage.getItem(key);
  }
  setValue(key: string, value: string) {
    localStorage.setItem(key, value);
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

}
