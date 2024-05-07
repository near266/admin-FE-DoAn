import { IUser } from '@/interfaces';

export class SettingForm {
  constructor(item: IUser = null) {
    if (item) {
      this.name = item.name;
      this.address = item.address;
      this.email = item.email;
      this.telephone = item.telephone;
      this.information = item.information;
      this.avatar = item.avatar;
    }
  }

  name: string = '';
  address: string = '';
  email: string = '';
  telephone: string = null;
  information: string = '';
  avatar: string = null;
}
