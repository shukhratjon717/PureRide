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

// Backend
export enum ProductEngineSize {
	BASE = 'BASE',
	LIGHTWEIGHT = 'LIGHTWEIGHT',
	ENTRYLEVEL = 'ENTRYLEVEL',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCED = 'ADVANCED',
	HEAVY = 'HEAVY',
}
registerEnumType(ProductEngineSize, { name: 'ProductEngineSize' });
export const ProductEngineSizeCC: Record<ProductEngineSize, number> = {
	[ProductEngineSize.BASE]: 50,
	[ProductEngineSize.LIGHTWEIGHT]: 125,
	[ProductEngineSize.ENTRYLEVEL]: 250,
	[ProductEngineSize.INTERMEDIATE]: 500,
	[ProductEngineSize.ADVANCED]: 750,
	[ProductEngineSize.HEAVY]: 1000,
};
export enum ProductFuelType {
	GASOLINE = 'GASOLINE',
	ELECTRICITY = 'ELECTRICITY',
}
registerEnumType(ProductFuelType, {
	name: 'ProductFuelType',
});
