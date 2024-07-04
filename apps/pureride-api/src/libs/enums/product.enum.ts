import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
  SPORTBIKE = 'SPORTBIKE',
  SKUTER = 'SKUTER',
  QUADRICICLE = 'QUADRICYCLE',
}
registerEnumType(ProductType, {
  name: 'ProductType',
});

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  DELETE = 'DELETE',
}
registerEnumType(ProductStatus, {
  name: 'ProductStatus',
});

export enum ProductLocation {
  SEOUL = 'SEOUL',
  BUSAN = 'BUSAN',
  INCHEON = 'INCHEON',
  DAEGU = 'DAEGU',
  GYEONGJU = 'GYEONGJU',
  GWANGJU = 'GWANGJU',
  CHONJU = 'CHONJU',
  DAEJON = 'DAEJON',
  JEJU = 'JEJU',
}
registerEnumType(ProductLocation, {
  name: 'ProductLocation',
});

export enum ProductEngineSize {
  LIGHTWEIGHT = 'LIGHTWEIGHT',
  ENTRYLEVEL = 'ENTRYLEVEL',
  INTERMEDIATE = 'INTERMEDIATE',
  HEAVY = 'HEAVY',
}
registerEnumType(ProductEngineSize, {
  name: 'ProductEngineSize',
});

export enum ProductFuelType {
  GASOLINE = 'GASOLINE',
  ELECTICITY = 'ELECTICITY',
}
registerEnumType(ProductFuelType, {
  name: 'ProductFuelType',
});
