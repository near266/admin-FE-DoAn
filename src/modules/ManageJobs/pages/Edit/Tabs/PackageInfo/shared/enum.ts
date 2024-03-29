export enum LICENSE_DATA_FIELD {
  career_field_id = 'career_field_id',
  enterpise_id = 'enterpise_id',
  license_code = 'license_code',
  license_name = 'license_name',
  selling_price = 'selling_price',
  listed_price = 'listed_price',
  period = 'period',
  quantity_record_view = 'quantity_record_view',
  quantity_record_take = 'quantity_record_take',
  description = 'description',
  status = 'status',
  title_video = 'title_video',
  link_video = 'link_video',
  images = 'images',
  activation_date = 'activation_date',
  expiration_date = 'expiration_date',
  discount = 'discount',
  total_amount = 'total_amount',
}

export const listCareer = [
  {
    label: 'Sale & Marketing',
    value: 0,
  },
  {
    label: 'Công nghệ thông tin',
    value: 1,
  },
  {
    label: 'Tài chính - Kế toán',
    value: 2,
  },
  {
    label: 'Vận hành',
    value: 3,
  },
];

export const listPeriod = [
  {
    label: '1 tháng',
    value: 1,
  },
  {
    label: '2 tháng',
    value: 2,
  },
  {
    label: '3 tháng',
    value: 3,
  },
  {
    label: '6 tháng',
    value: 6,
  },
  {
    label: '1 năm',
    value: 12,
  },
];

export const listStatus = [
  {
    label: 'Chưa kích hoạt',
    value: 0,
  },
  {
    label: 'Đã kích hoạt',
    value: 1,
  },
  {
    label: 'Đã hết hạn',
    value: 2,
  },
];
