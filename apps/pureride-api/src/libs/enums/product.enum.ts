import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
	SPORTBIKE = 'SPORTBIKE',
	SKUTER = 'SKUTER',
	QUADRICYCLE = 'QUADRICYCLE',
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
	BASE = "BASE",
	LIGHTWEIGHT = 'LIGHTWEIGHT',
	ENTRYLEVEL = 'ENTRYLEVEL',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCED="ADVANCED",
	HEAVY = 'HEAVY',
}
registerEnumType(ProductEngineSize, {
	name: 'ProductEngineSize',
});

export enum ProductFuelType {
	GASOLINE = 'GASOLINE',
	ELECTRICITY = 'ELECTRICITY',
}
registerEnumType(ProductFuelType, {
	name: 'ProductFuelType',
});
