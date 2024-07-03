import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
	SPORTBIKE = 'SPORTBIKE',
	SKUTER = 'SKUTER',
	QUADRICICLE = 'QUADRICICLE',
}
registerEnumType(ProductType, {
	name: 'PropertyType',
});

export enum ProductStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(ProductStatus, {
	name: 'PropertyStatus',
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
	name: 'PropertyLocation',
});
