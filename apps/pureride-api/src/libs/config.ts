import { ObjectId } from 'bson';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const availableAgentSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];
export const availableMembersSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews'];

export const availableOptions = ['propertyBarter', 'propertyRent'];
export const availableProductSorts = [
	'createdAt',
	'updatedAt',
	'productLikes',
	'productView',
	'productRank',
	'productPrice',
];

export const availableBoardArticles = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews'];

export const availableCommentSorts = ['createdAt', 'updatedAt'];
/**  IMAGE CONFIGURATION (config.js) **/

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};

export const lookupMember = {
	$lookup: {
		from: 'members',
		localField: 'memberId',
		foreignField: '_id',
		as: 'memberData',
	},
};
