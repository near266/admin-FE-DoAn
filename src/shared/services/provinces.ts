interface Base {
  name: string;
  code: number;
  codename: string;
  division_type: string;
}
export interface IProvinces extends Base {
  district: IDistrict;
  phone_code: number;
}

export interface IDistrict extends Base {
  wards: [];
  province_code: number;
}

export interface IWard extends Base {
  district_code: number;
}
class ProvinceProvider {
  DEPTH = 2;
  APIEndPoint = process.env.NEXT_PUBLIC_PROVINCES_API_URL;

  static query = {
    provinces: '/p',
    district: '/p',
  };

  async fetchProvinces() {
    const provinces: IProvinces[] = await fetch(
      `${this.APIEndPoint}${ProvinceProvider.query.provinces}`
    ).then((res) => res.json());
    return provinces;
  }
  async fetchDistricts(provinceCode) {
    const { districts } = await fetch(
      `${this.APIEndPoint}${ProvinceProvider.query.provinces}/${provinceCode}?depth=${this.DEPTH}`
    ).then((res) => res.json());
    return districts;
  }

  async fetchWards(districtCode) {
    const wards: IWard[] = await fetch(
      `${this.APIEndPoint}${ProvinceProvider.query.district}/${districtCode}`
    ).then((res) => res.json());
    return wards;
  }
}

export const provinceService = new ProvinceProvider();
