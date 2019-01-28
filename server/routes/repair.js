var mongoose = require( 'mongoose' );
var Repair = require('../models/Repair');
var config = require('../config');

exports.saverepair = function(req, res, next){
	const uid = req.params.id;
	const rdt = req.body.rsdate;
    const rcom = req.body.rcomment;
    const fix = req.body.rfix;
	const tech = req.body.rtech;
    const repairid = req.body.repairid;

    if (!uid ||  !rdt || !rcom || !fix || !tech) {
        return res.status(422).send({ success: false, message: 'Posted data is not correct or incompleted.' });
    } else {
		
	if (repairid) {
		//Edit repair
		Repair.findById(repairid).exec(function(err, repair){
			if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
				
			if(repair) {
				repair.repairsdate = rdt;
                repair.repaircomment = rcom;
                repair.repairfdate = fix;
                repair.repairtech = tech;
			}
			repair.save(function(err) {
				if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
				res.status(201).json({
					success: true,
					message: 'repair updated successfully'
				});
			});
		});

	}else{
		
		// Add new repair
		let oRepair = new Repair({
			userid: uid,
			repairsdate: rdt,
			repaircomment: rcom,
			repairfdate: fix,
			repairtech: tech
		});

		oRepair.save(function(err) {
			if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
				
			res.status(201).json({
				success: true,
				message: 'Repair saved successfully'
			});
		});

	}
    }
}

exports.delrepair = function(req, res, next) {
	Repair.remove({_id: req.params.id}, function(err){
        if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
        res.status(201).json({
		success: true,
		message: 'Repair removed successfully'
	});
    });
}

exports.getrepair = function(req, res, next){
	Repair.find({_id:req.params.id}).exec(function(err, repair){
        if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err }); 
        }
        res.status(201).json({
		success: true, 
		data: repair
	});
    });
}

exports.repairtotal = function(req, res, next){
    const uid = req.params.id || req.param('uname');
    const rptype = req.body.report || req.param('report');
    const from_dt = req.body.startdt || req.param('startdt');
    const to_dt = req.body.enddt || req.param('enddt');
    const fromdt = new Date(from_dt);
    const todt = new Date(to_dt);
    
    let match = {};
    
    if(rptype === 'opt1'){
        let oDt = new Date();
        let month = oDt.getUTCMonth() + 1; //months from 1-12
        let year = oDt.getUTCFullYear();

        let fdt = new Date(year + "/" + month + "/1");
        let tdt = new Date(year + "/" + month + "/31");

        match = { "$match": {userid:uid, repairsdate:{$gte: fdt, $lte: tdt}} };

    } else if (rptype === 'opt2'){
        match = { "$match": { userid:uid, repairsdate:{$gte: fromdt, $lte: todt}} };
    } else {
        match = { "$match": { userid:uid } };
    }
    
       
}

exports.repairreport = function(req, res, next){
    const uid = req.params.id || req.query.uname;
    const rptype = req.body.report || req.query.report;
    const from_dt = req.body.startdt || req.query.startdt;
    const to_dt = req.body.enddt || req.query.enddt;
    const fromdt = new Date(from_dt);
    const todt = new Date(to_dt);

    let limit = parseInt(req.query.limit);
    let page = parseInt(req.body.page || req.query.page);
    let sortby = req.body.sortby || req.query.sortby;
    let query = {};

    if(!limit || limit < 1) {
	limit = 10;
    }

    if(!page || page < 1) {
	page = 1;
    }

    if(!sortby) {
	sortby = 'repairsdate';
    }

    var offset = (page - 1) * limit;

    if (!uid || !rptype) {
        return res.status(422).send({ error: 'Posted data is not correct or incompleted.'});
	}else if(rptype === 'opt2' && !fromdt && !todt){
		return res.status(422).send({ error: 'From or To date missing.'});
	}else if(fromdt > todt){   
		 return res.status(422).send({ error: 'From date cannot be greater than To date.'});
	}else{

		if(rptype === 'opt1'){
			// returns records for the current month
			let oDt = new Date();
			let month = oDt.getUTCMonth() + 1; //months from 1-12
			let year = oDt.getUTCFullYear();

			let fdt = new Date(year + "/" + month + "/1");
			let tdt = new Date(year + "/" + month + "/31");
	
			query = { userid:uid, repairsdate:{$gte: fdt, $lte: tdt} };

			Repair.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});

		} else if (rptype === 'opt2'){
			// return records within given date range
			query = { userid:uid, repairsdate:{$gte: fromdt, $lte: todt} };

			Repair.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});

		} else {
			// returns all repairs records for the user
			query = { userid:uid };

			Repair.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});
		}

		var options = {
			select: 'repairsdate repaircomment repairfdate repairtech',
			sort: sortby,
			offset: offset,
			limit: limit
		}

		Repair.paginate(query, options).then(function(result) {
			res.status(201).json({
				success: true, 
				data: result
			});
		});
	}
}
