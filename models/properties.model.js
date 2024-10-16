'use strict';
const pool=require('../config/db.conn');
const moment=require("moment");
const AppHelper = require('../helper/app.helper');

const subQuery =`,(SELECT CONCAT(user_firstname,' ',user_lastname)AS landlordname FROM user_login WHERE user_login.user_login_id=properties.landlord_id)AS landlord_name,(SELECT name FROM countries WHERE countries.country_code=properties.country)AS country_name,(SELECT name FROM cities WHERE cities.id=properties.city)AS city_name,(SELECT name FROM states WHERE states.id=properties.states)AS states_name,(SELECT file_thumbnail FROM properties_photo WHERE properties_photo.property_id=properties.id LIMIT 1 )AS photo_thumbnail`;

const Properties = function(user){
  this.user_login_id = user.user_login_id;
  this.user_login_username = user.user_login_username;
  this.user_firstname = user.user_firstname;
  this.user_lastname = user.user_lastname;
  this.user_login_status = user.user_login_status;
};

const NewPropertyModel = function(thisProp){
    const getAmenities=thisProp.amenities;
    this.id_reg = AppHelper.app_make_id(8);
    this.name= thisProp.name;
    this.landlord_id=thisProp.landlord_id;
    this.country=thisProp.country;
    this.states=thisProp.states;
    this.city=thisProp.city;
    this.description=thisProp.description;
    this.built_size=thisProp.built_size;
    this.bedrooms_qt=thisProp.bathrooms_qt;
    this.bathrooms_qt=thisProp.bathrooms_qt;
    this.floors_qt=thisProp.floors_qt;
    this.geolocation_map=thisProp.geolocation_map;
    this.category=thisProp.category;
    this.price=thisProp.price;
    this.year_built=thisProp.year_built;
    this.amenities=getAmenities.toString();//String(thisProp.amenities).split(',');
    this.contract_term=thisProp.contract_term;
    this.date_available=moment(thisProp.date_available).format('YYYY-MM-DD HH:mm:ss');
    this.status=thisProp.status;
    this.date_created=moment().format('YYYY-MM-DD HH:mm:ss');
    this.user_created=thisProp.user_created;
    this.is_deleted=0;
    this.is_public=thisProp.is_public;
    this.availability=thisProp.availability;
    // this.comments=thisProp.comments;
};

const UpdatePropertyModel = function(thisProp){
    const getAmenities=thisProp.amenities;
    this.name= thisProp.name;
    this.country=thisProp.country;
    this.states=thisProp.states;
    this.city=thisProp.city;
    this.description=thisProp.description;
    this.built_size=thisProp.built_size;
    this.geolocation_map=thisProp.geolocation_map;
    this.bedrooms_qt=thisProp.bathrooms_qt;
    this.bathrooms_qt=thisProp.bathrooms_qt;
    this.floors_qt=thisProp.floors_qt;
    this.category=thisProp.category;
    this.price=thisProp.price;
	this.year_built=thisProp.year_built;
    this.amenities=getAmenities.toString();//String(thisProp.amenities).split(',');
    this.contract_term=thisProp.contract_term;
    this.date_available=moment(thisProp.date_available).format('YYYY-MM-DD HH:mm:ss');
    this.status=thisProp.status;
    this.date_updated=moment().format('YYYY-MM-DD HH:mm:ss');
    this.user_updated=thisProp.user_updated;
    // this.is_deleted=0;
    this.is_public=thisProp.is_public;
    this.availability=thisProp.availability;
    // this.comments=thisProp.comments;
};
const DeletePropertyModel = function(thisProp){
    this.date_updated=moment().format('YYYY-MM-DD HH:mm:ss');
    this.user_updated=thisProp.user_updated;
    this.is_deleted=1;
};

let qCreateProperty = function(insertNewRecord){
	return new Promise(function(resolve, reject){
		let sqlStement = `INSERT INTO properties SET ?`;
		pool.query(sqlStement,insertNewRecord,function(err,rows){
			let resStat = {status:'ok',data:null};
			if(err){
				resStat.status='error';
				resStat.message=err;
			}else{
				resStat = {status:'ok',data:rows,property_id:rows.insertId};
			}
			resolve(resStat);
		});
	});
}

let qUpdateProperty = function(insertNewRecord,propertyID){
	return new Promise(function(resolve, reject){
		let sqlStement = `UPDATE properties SET ? WHERE id=${propertyID}`;
		pool.query(sqlStement,insertNewRecord,function(err,rows){
			let resStat = {status:'ok',data:null};
			if(err){
				resStat.status='error';
				resStat.message=err;
			}else{
				resStat = {status:'ok',data:rows,property_id:propertyID};
			}
			resolve(resStat);
		});
	});
}

let queryInsertPhotoProperty = function(insertNewRecord){
	return new Promise(function(resolve, reject){
		let sqlStement = `INSERT INTO properties_photo SET ?`;
		pool.query(sqlStement,insertNewRecord,function(err,rows){
			let resStat = {status:'ok',data:null};
			if(err){
				resStat.status='error';
				resStat.message=err;
			}else{
				resStat = {status:'ok',data:rows};
			}
			resolve(resStat);
		});
	});
}

let queryInsertMultiplePhotoProperty = function(insertNewRecord){
	return new Promise(function(resolve, reject){
		let sqlStement = `INSERT INTO properties_photo (property_id,file_size,file_mime_type,file_name,file_location,file_thumbnail,file_slider,file_category) VALUES ?;`;
		pool.query(sqlStement,[insertNewRecord],function(err,rows){
			let resStat = {status:'ok',data:null};
			if(err){
				resStat.status='error';
				resStat.message=err;
			}else{
				resStat = {status:'ok',data:rows};
			}
			resolve(resStat);
		});
	});
}

let queryPhotoFindDT = function(regId){
	return new Promise(function(resolve, reject){
		let sqlStement = `SELECT * FROM properties_photo WHERE id = ${regId}`;
		pool.query(sqlStement,function(err,rows){
			let resStat = {status:'ok',data:null};
			if(err){
				resStat.status='error';
				resStat.message=err;
			}else{
				resStat = {status:'ok',data:rows[0]};
			}
			resolve(resStat);
		});
	});
}

let queryPhotoRemove = function(regId){
	return new Promise(function(resolve, reject){
		let sqlStement = `DELETE FROM properties_photo WHERE id = ${regId}`;
		pool.query(sqlStement,function(err,rows){
			let resStat = {status:'ok',data:null};
			if(err){
				resStat.status='error';
				resStat.message=err;
			}else{
				resStat = {status:'ok',data:rows};
			}
			resolve(resStat);
		});
	});
}
let queryGetCities = function(recordIDs){
	return new Promise(function(resolve, reject){
		let sqlStement = `SELECT *  FROM cities WHERE state_id=${recordIDs} ORDER BY name`;
		pool.query(sqlStement,function(err,rows){
			if(err){
				resolve({ status: "error", message: err }); 
			}else{
				resolve({ status: "ok", data: rows });
			}
		});
	});
}

let queryGetProperty = function(recordIDs){
	return new Promise(function(resolve, reject){
		let sqlStement = `SELECT *${subQuery}  FROM properties WHERE id_reg='${recordIDs}'`;
		pool.query(sqlStement,function(err,rows){
			if(err){
				resolve({ status: "error", message: err }); 
			}else{
				if(rows.length >0){
					resolve({ status: "ok", data: rows[0] });
				}else{
					resolve({ status: "empty", data: [] });
				}
			}
		});
	});
}
let queryGetAllProperty = function(){
	return new Promise(function(resolve, reject){
		const queryPhotos=`,(SELECT GROUP_CONCAT(file_name)as groupFiles FROM properties_photo WHERE properties_photo.property_id =properties.id)AS photosProperty`;
		let sqlStement = `SELECT *${subQuery} ${queryPhotos}  FROM properties ORDER BY date_created DESC`;
		pool.query(sqlStement,function(err,rows){
			if(err){
				resolve({ status: "error", message: err }); 
			}else{
				resolve({ status: "ok", data: rows });
			}
		});
	});
}
let querySearchProperty = function(setParameterFilter){
	return new Promise(function(resolve, reject){
		const queryPhotos=`,(SELECT GROUP_CONCAT(file_name)as groupFiles FROM properties_photo WHERE properties_photo.property_id =properties.id)AS photosProperty`;
		let sqlStement = `SELECT *${subQuery} ${queryPhotos}  FROM properties ${setParameterFilter} ORDER BY date_created DESC`;
		pool.query(sqlStement,function(err,rows){
			if(err){
				resolve({ status: "error", message: err }); 
			}else{
				resolve({ status: "ok", data: rows });
			}
		});
	});
}
let queryGetPhotosProperty = function(recordIDs){
	return new Promise(function(resolve, reject){
		let sqlStement = `SELECT *  FROM properties_photo WHERE property_id=${recordIDs} ORDER BY id`;
		pool.query(sqlStement,function(err,rows){
			if(err){
				resolve({ status: "error", message: err }); 
			}else{
				resolve({ status: "ok", data: rows });
			}
		});
	});
}

let queryGetStates = function(recordIDs){
	return new Promise(function(resolve, reject){
		let sqlStement = `SELECT *  FROM states WHERE country_code='${recordIDs}' ORDER BY name`;
		pool.query(sqlStement,function(err,rows){
			if(err){
				resolve({ status: "error", message: err }); 
			}else{
				resolve({ status: "ok", data: rows });
			}
		});
	});
}

let queryGetPropertiesDataTable = function(landLordID,optPage,optLimit,sortBy,sortOrder,filterText,filterFields){
	
	return new Promise(function(resolve, reject){
		let filterDate = moment().format('YYYY-MM').toString()+'-01 00:00:00';
        let queryJoin='',filterByLandlord='';
		
		let sortDesc='ASC'; if( sortOrder == true){ sortDesc='DESC'; }
		if(landLordID !=0){ filterByLandlord=` AND landlord_id=${landLordID} `; }

		let startLimit =0; if( optPage > 1){ startLimit=(optPage-1)*optLimit;}
		let sQueryFilter=''; sQueryFilter =` WHERE is_deleted=0 ${filterByLandlord} `; queryJoin='AND '; 
		if(filterText !== null && typeof filterText != "undefined"){
			if(filterText.length > 0){
				if(typeof filterText == 'number'){
					sQueryFilter+=` price=${filterText}`; 
				}else{
					sQueryFilter+=` name LIKE '%${filterText}%' `;
				}
			}
		}
		if(filterFields){
			
			// if(filterFields.user_login_status !=''){
			// 	sQueryFilter +=` ${queryJoin} user_login_status='${filterFields.user_login_status}'`; 
			// }
			// if(filterFields.user_type !=''){
			// 	sQueryFilter +=` ${strWhere} ${queryJoin} user_type='${filterFields.user_type}' `; queryJoin='AND '; strWhere=''
			// }
			
		}
		let OrderBy=`${sortBy} ${sortDesc}`;
		
		
	
		let sqlStement = `SELECT *${subQuery} FROM properties ${sQueryFilter} ORDER BY ${OrderBy}  LIMIT ${startLimit},${optLimit}`; 
		
		pool.query(sqlStement,function(err,rows){
			let resStat = {status:'error',data:null};
			if(err){
				console.log('err',err);
			}else{
				resolve(rows);
			}
		});
	});
}

let queryQueueGetCounProperties = function(landLordID,filterFields){
	return new Promise(function(resolve, reject){
		let filterByLandlord='';
		if(landLordID !=0){ filterByLandlord=` AND landlord_id=${landLordID} `; }
		let sQueryFilter=` WHERE is_deleted=0 ${filterByLandlord} `, queryJoin='AND';
		if(filterFields){
			// if(filterFields.user_login_status !=''){
			// 	sQueryFilter +=` ${queryJoin} user_login_status='${filterFields.user_login_status}'`;
			// }
			
			// if(filterFields.user_type !=''){
			// 	sQueryFilter +=` ${strWhere} ${queryJoin} user_type='${filterFields.user_type}'`;
			// }
		}
		let sqlStement = `SELECT COUNT(id)AS countItems FROM properties ${sQueryFilter}  ORDER BY id`;
		// let sqlStement = `SELECT COUNT(id)AS countItems,user_status FROM agl_user_login WHERE user_company LIKE '%${companyId}%'  GROUP BY user_status ORDER BY user_status`;
		pool.query(sqlStement,function(err,rows){
			let resStat = {status:'error',data:null};
			if(err){
				console.log('err',err);
			}else{
				resolve(rows);
			}
		});
	});
}
Properties.getCities=function(countryCode,result){
	queryGetCities(countryCode).then(function(uidItems){
		result(null, uidItems);
	});
}

Properties.getStates=function(countryCode,result){
	queryGetStates(countryCode).then(function(uidItems){
		result(null,uidItems);
	});
}

Properties.createNewProperty=function(req, res,result){
    const objNewProperty=new NewPropertyModel(req.body);
	qCreateProperty(objNewProperty).then(function(uidItems){
		result(null,uidItems);
	});
}

Properties.getPropertyAndPhotos=function(propertyIdReg,result){
    //  const objNewProperty=new NewPropertyModel(req.body);
    
	queryGetProperty(propertyIdReg).then(function(uidItems){
        if(uidItems.status =='ok'){
			let setAmenities=uidItems.data.amenities; setAmenities=setAmenities.split(",");
			uidItems.data.amenities=setAmenities;
            queryGetPhotosProperty(uidItems.data.id).then(function(uidPhotos){
                const uidPropertyPhotos={status:'ok',data:uidItems.data,photos:uidPhotos.data};
                result(null,uidPropertyPhotos);
            });
        }else{
            result(null,uidItems);
        }
    });
}
Properties.getListPropertyAndPhotos=function(result){
	queryGetAllProperty().then(function(uidItems){
        if(uidItems.status =='ok'){
            result(null,uidItems);
        }else{
            result(null,uidItems);
        }
    });
}
Properties.searchPropertiesList=function(req,result){
     const filterSearch=AppHelper.app_build_filter_search(req.body);
	 querySearchProperty(filterSearch).then(function(uidItems){
        if(uidItems.status =='ok'){
            result(null,uidItems);
        }else{
            result(null,uidItems);
        }
    });
}
Properties.updatePropertyAndPhotos=function(propertyIdReg,objUpdate,result){
     const objUpdateProperty=new UpdatePropertyModel(objUpdate);
    
	 qUpdateProperty(objUpdateProperty,propertyIdReg).then(function(uidItems){
        if(uidItems.status =='ok'){
			result(null,uidItems);
            // queryGetPhotosProperty(uidItems.data.id).then(function(uidPhotos){
            //     const uidPropertyPhotos={status:'ok',data:uidItems.data,photos:uidPhotos.data};
            //     result(null,uidPropertyPhotos);
            // });
        }else{
            result(null,uidItems);
        }
    });
}
Properties.deletePropertyAndPhotos=function(propertyIdReg,objUpdate,result){
     const objUpdateProperty=new DeletePropertyModel(objUpdate);
	 qUpdateProperty(objUpdateProperty,propertyIdReg).then(function(uidItems){
        if(uidItems.status =='ok'){
			result(null,uidItems);;
        }else{
            result(null,uidItems);
        }
    });
}
Properties.photoUploadProperty=function(objInsert,result){
	queryInsertPhotoProperty(objInsert).then(function(uidItems){
		result(null,uidItems);
	});
}

Properties.photoUploadMultipleProperty=function(objInsert,result){
	queryInsertMultiplePhotoProperty(objInsert).then(function(uidItems){
		result(null,uidItems);
	});
}

Properties.photoRemoveFile=function(regId,result){
	queryPhotoFindDT(regId).then(function(uidItems){
		console.log(uidItems);
		queryPhotoRemove(regId).then(function(uiRemove){
			result(null,uidItems);
		});
	});
}
Properties.dataTableProperties=function(landLordID,optPage,optLimit,sortBy,sortOrder,filterText,filterFields,result){
	queryGetPropertiesDataTable(landLordID,optPage,optLimit,sortBy,sortOrder,filterText,filterFields).then(function(uidItems){
		queryQueueGetCounProperties(landLordID,filterFields).then(function(uid){
			result(null, {count:uid,items:uidItems});
		});
	});
}

module.exports= Properties;