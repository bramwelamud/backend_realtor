'use strict';

const Properties = require('../model/properties.model');
const moment=require("moment");
// const appUtils = require('../helper/app.utils');

exports.getCities = function(req, res) {
	const countryCode = req.params.id
	Properties.getCities(countryCode, function(err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ' + countryCode);
		return res.send(items);
	});
};

exports.getStates = function(req, res) {
	const countryCode = req.params.id
	Properties.getStates(countryCode, function(err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ' + countryCode);
		return res.send(items);
	});
};

exports.createNewPropertyLandlord = function(req, res) {
	// const countryCode = req.params.id
	Properties.createNewProperty(req, res, function(err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ' + countryCode);
		return res.send(items);
	});
};

exports.viewPropertyLandlord = function(req, res) {
	const propertyIdReg = req.params.idReg;
	Properties.getPropertyAndPhotos(propertyIdReg, function(err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ' + countryCode);
		return res.send(items);
	});
};
exports.getListViewProperties = function(req, res) {
	Properties.getListPropertyAndPhotos(function(err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		return res.send(items);
	});
};
exports.searchProperties = function(req, res) {
	Properties.searchPropertiesList(req, function(err, items) {
		if (err) return res.status(500).send('Error occurred during fetching properties.');

		// Check if no matching properties were found
		if (!items || items.length === 0) {
			// Perform a fallback search for properties within a 5-mile radius
			Properties.searchPropertiesWithinRadius(req, 5, function(err, nearbyItems) {
				if (err) return res.status(500).send('Error occurred during fetching nearby properties.');
				return res.send(nearbyItems);
			});
		} else {
			// Return the found properties
			return res.send(items);
		}
	});
};

exports.updatePropertyLandlord = function(req, res) {
	const propertyIdReg = req.params.idReg;
	Properties.updatePropertyAndPhotos(propertyIdReg,req.body, function(err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ' + countryCode);
		return res.send(items);
	});
};
exports.deletePropertyLandlord = function(req, res) {
	const propertyIdReg = req.params.idReg;
	Properties.deletePropertyAndPhotos(propertyIdReg,req.body, function(err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ' + countryCode);
		return res.send(items);
	});
};

exports.doDTProperties = function(req, res) {
	const landLordID = req.body.landlord_id;
	// const user_part_of = req.body.user_part_of;
	const optPage = req.body.opt_page;
	const optLimit = req.body.opt_limit;
	const sortBy = req.body.opt_sortby;
	const sortOrder = req.body.opt_sort_order;
	const filter = req.body.opt_filter;
	const filterFields = req.body.opt_filter_fields;
	
	Properties.dataTableProperties(landLordID,optPage,optLimit,sortBy,sortOrder,filter,filterFields, function(err, items) {
		if (err){
			return res.status(500).send('Error occured during fetching item for unique_id ');
		}else{
			return res.send(items);
		}
	});
};